// File: api/validate-token.js
const crypto = require("crypto");
const { tokenDB } = require("../lib/database.cjs");
const { rateLimit } = require("../lib/rateLimit.js");

module.exports = rateLimit(async (req, res) => {
  const { token, expires, email, sig } = req.query;
  if (!token || !expires || !email || !sig) {
    return res
      .status(400)
      .json({ status: "invalid", error: "Missing parameters" });
  }

  // Check expiration
  const expiresNum = parseInt(expires, 10);
  if (isNaN(expiresNum) || Date.now() > expiresNum) {
    return res.status(200).json({ status: "expired" });
  }

  // Verify HMAC signature using same secret
  const SECRET =
    process.env.DOWNLOAD_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY;
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(`${token}|${email}|${expires}`);
  const expectedSig = hmac.digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return res.status(200).json({ status: "invalid" });
  }

  // Check token status in database
  const status = tokenDB.getTokenStatus(token);
  return res.status(200).json({ status });
});
