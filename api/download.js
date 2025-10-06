// File: api/download.js
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { rateLimit } = require("../lib/rateLimit");
const { maskEmail, logger } = require("../lib/logger");
const { tokenDB } = require("../lib/database.cjs");

module.exports = rateLimit(async (req, res) => {
  const { token, expires, email, sig } = req.query;

  // Basic parameter check
  if (!token || !expires || !email || !sig) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Verify expiration
  const expiresNum = parseInt(expires, 10);
  if (isNaN(expiresNum) || Date.now() > expiresNum) {
    return res.status(401).json({ error: "Link has expired" });
  }

  // Reconstruct and verify HMAC signature
  const SECRET =
    process.env.DOWNLOAD_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY;
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(`${token}|${email}|${expires}`);
  const expectedSig = hmac.digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    logger.warn("Invalid signature for email:", email);
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Check token validity and decrement download count
  if (!tokenDB.validateAndDecrement(token)) {
    logger.warn("Token validation failed for email:", email);
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Stream the PDF file to the client
  const filePath = path.join(
    process.cwd(),
    "public",
    "Hausa_Wedding_Guide.pdf"
  );
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ error: "Guide not found on server" });
  }

  logger.infoWithEmail("PDF download successful for:", email);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Hausa_Wedding_Guide.pdf"'
  );
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});
