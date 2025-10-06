// File: lib/rateLimit.js
// A simple in-memory rate limiter per IP (uses token-bucket logic).
module.exports.rateLimit = (handler, limit = 60, windowMs = 60 * 1000) => {
  const hits = {};

  return async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const now = Date.now();

    if (!hits[ip] || now - hits[ip].start > windowMs) {
      hits[ip] = { count: 1, start: now };
    } else {
      hits[ip].count++;
    }

    if (hits[ip].count > limit) {
      return res.status(429).json({ error: "Too many requests" });
    }
    return handler(req, res);
  };
};
