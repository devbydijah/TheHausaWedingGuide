// File: api/validate-token.js
const crypto = require("crypto");

module.exports = async (req, res) => {
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

  // (Future) Here you could check download count against a limit
  // e.g., if (downloads >= maxDownloads) return { status: 'limit_reached' }

  return res.status(200).json({ status: "valid" });
};
