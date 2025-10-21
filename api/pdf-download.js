import crypto from "crypto";
import path from "path";
import fs from "fs";

/**
 * Verifies the signature of the download link.
 */
function verifyTokenSignature(token, email, expires, sig, mode) {
  const SECRET =
    mode === "live"
      ? process.env.DOWNLOAD_TOKEN_SECRET_LIVE
      : process.env.DOWNLOAD_TOKEN_SECRET_TEST;

  if (!SECRET) {
    console.error(
      `[PDF-DOWNLOAD] ❌ No secret key found for signature verification in ${mode} mode.`
    );
    return { valid: false, error: "Server configuration error" };
  }

  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(`${token}|${email}|${expires}`);
  const expectedSig = hmac.digest("hex");

  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return { valid: false, error: "Invalid signature" };
    }
  } catch (error) {
    return { valid: false, error: "Invalid signature format" };
  }

  return { valid: true };
}

/**
 * Main handler for serving the PDF file.
 */
export default async function handler(req, res) {
  try {
    const { token, expires, email, sig, mode = "test" } = req.query; // Default to 'test' for safety

    if (!token || !expires || !email || !sig) {
      return res
        .status(400)
        .json({ error: "Missing required download parameters" });
    }

    if (Date.now() > parseInt(expires, 10)) {
      return res.status(403).json({ error: "This download link has expired." });
    }

    const verification = verifyTokenSignature(token, email, expires, sig, mode);
    if (!verification.valid) {
      return res.status(403).json({ error: verification.error });
    }

    // If all checks pass, serve the file.
    const filePath = path.resolve("./public", "Hausa_Wedding_Guide.pdf");

    if (fs.existsSync(filePath)) {
      console.log(`[PDF-DOWNLOAD] ✅ Serving PDF to ${email}`);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="Hausa Wedding Guide.pdf"'
      );
      fs.createReadStream(filePath).pipe(res);
    } else {
      console.error(
        `[PDF-DOWNLOAD] ❌ PDF file not found at path: ${filePath}`
      );
      res
        .status(404)
        .json({ error: "File not found. Please contact support." });
    }
  } catch (error) {
    console.error("[PDF-DOWNLOAD] ❌ Unexpected error:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
}
