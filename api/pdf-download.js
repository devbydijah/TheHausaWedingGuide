import crypto from "crypto";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// --- Initialize Supabase Client (with safety check) ---
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

if (!supabase) {
  console.warn(
    "[PDF-DOWNLOAD] Supabase variables not set. API will be non-functional."
  );
}

/**
 * Verifies the signature of the download link.
 */
function verifyTokenSignature(token, email, expires, sig) {
  const SECRET =
    process.env.DOWNLOAD_TOKEN_SECRET ||
    process.env.PAYSTACK_SECRET_KEY ||
    process.env.PAYSTACK_TEST_SECRET_KEY;

  if (!SECRET) {
    console.error(
      "[PDF-DOWNLOAD] ❌ No secret key found for signature verification."
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
    const { token, expires, email, sig } = req.query;

    if (!token || !expires || !email || !sig) {
      return res
        .status(400)
        .json({ error: "Missing required download parameters" });
    }

    if (Date.now() > parseInt(expires, 10)) {
      return res.status(403).json({ error: "This download link has expired." });
    }

    const verification = verifyTokenSignature(token, email, expires, sig);
    if (!verification.valid) {
      return res.status(403).json({ error: verification.error });
    }

    // --- New Supabase Logic ---
    if (!supabase) {
      return res
        .status(503)
        .json({ error: "Database service is not configured." });
    }

    // 1. Find the token in the database
    const { data: tokenData, error: fetchError } = await supabase
      .from("download_tokens")
      .select("download_count")
      .eq("token", token)
      .single();

    if (fetchError || !tokenData) {
      console.error(
        `[PDF-DOWNLOAD] ❌ Token not found in DB for ${email}: ${token}`
      );
      return res.status(403).json({ error: "Download token is invalid." });
    }

    // 2. Check if downloads are remaining
    if (tokenData.download_count <= 0) {
      console.warn(
        `[PDF-DOWNLOAD] ⚠️ Exhausted download attempts for ${email}`
      );
      return res.status(403).json({ error: "Maximum download limit reached." });
    }

    // 3. Decrement the download count
    const { error: updateError } = await supabase
      .from("download_tokens")
      .update({ download_count: tokenData.download_count - 1 })
      .eq("token", token);

    if (updateError) {
      console.error(
        `[PDF-DOWNLOAD] ❌ Failed to decrement download count for ${email}:`,
        updateError
      );
      // We can still proceed to serve the file, but we should log this error.
    }
    // --- End of Supabase Logic ---

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
