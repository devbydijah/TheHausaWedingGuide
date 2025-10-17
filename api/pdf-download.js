// PDF Download Handler - Merged endpoint
// Validates token and serves PDF file
// GET /api/pdf-download?token=xxx&expires=xxx&email=xxx&sig=xxx

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { rateLimit } = require("./_lib/rateLimit");
const { logger } = require("../lib/logger");
const { tokenDB } = require("../lib/database.cjs");

/**
 * Verify token signature
 */
function verifyTokenSignature(token, email, expires, sig) {
  const SECRET =
    process.env.DOWNLOAD_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY;

  if (!SECRET) {
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
 * Main handler
 */
module.exports = rateLimit(async (req, res) => {
  const { token, expires, email, sig } = req.query;

  // Validate required parameters
  if (!token || !expires || !email || !sig) {
    logger.warn("[PDF-DOWNLOAD] Missing required parameters");
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Check expiration (24 hours)
  const expiresNum = parseInt(expires, 10);
  if (isNaN(expiresNum) || Date.now() > expiresNum) {
    logger.warn(
      `[PDF-DOWNLOAD] Expired token for: ${email.replace(/(.{2}).*(@.*)/, "$1***$2")}`
    );
    return res
      .status(401)
      .json({ error: "Download link has expired (24 hours)" });
  }

  // Verify HMAC signature
  const verification = verifyTokenSignature(token, email, expires, sig);
  if (!verification.valid) {
    logger.warn(
      `[PDF-DOWNLOAD] Invalid signature for: ${email.replace(/(.{2}).*(@.*)/, "$1***$2")}`
    );
    return res.status(401).json({ error: verification.error });
  }

  // Validate token in database and decrement download count
  if (!tokenDB.validateAndDecrement(token)) {
    logger.warn(
      `[PDF-DOWNLOAD] Token validation failed for: ${email.replace(/(.{2}).*(@.*)/, "$1***$2")}`
    );
    return res.status(401).json({
      error:
        "Invalid or exhausted download token. Maximum 3 downloads allowed.",
    });
  }

  // Locate PDF file
  const filePath = path.join(
    process.cwd(),
    "public",
    "Hausa_Wedding_Guide.pdf"
  );

  if (!fs.existsSync(filePath)) {
    logger.error("[PDF-DOWNLOAD] PDF file not found on server");
    return res
      .status(500)
      .json({ error: "Guide not found on server. Please contact support." });
  }

  // Stream PDF to client
  logger.info(
    `[PDF-DOWNLOAD] ✅ Serving PDF to: ${email.replace(/(.{2}).*(@.*)/, "$1***$2")}`
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Hausa_Wedding_Guide.pdf"'
  );
  res.setHeader(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );
  res.setHeader("Expires", "0");
  res.setHeader("Pragma", "no-cache");

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  stream.on("error", (error) => {
    logger.error("[PDF-DOWNLOAD] Stream error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to download file" });
    }
  });
});
