// api/_lib/rateLimit.js

// Use a Map for better memory management. This will persist across "warm" invocations.
const ipRequestStore = new Map();

/**
 * A simple rate-limiter for Vercel serverless functions.
 * @param {Function} handler The API handler function to wrap.
 * @param {number} limit The number of allowed requests per window.
 * @param {number} windowMs The time window in milliseconds.
 * @returns {Function} The wrapped handler function.
 */
export function rateLimit(handler, limit = 60, windowMs = 60000) {
  return async (req, res) => {
    // Get the user's IP address. 'x-forwarded-for' is reliable on Vercel.
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const now = Date.now();
    const windowStart = now - windowMs;

    // Get timestamps of recent requests from this IP
    const userRequests = (ipRequestStore.get(ip) || []).filter(
      (timestamp) => timestamp > windowStart
    );

    if (userRequests.length >= limit) {
      console.warn(`[RATE-LIMIT] Blocked request from IP: ${ip}`);
      return res
        .status(429)
        .json({ error: "Too many requests, please try again later." });
    }

    // Add the current request timestamp and update the store
    ipRequestStore.set(ip, [...userRequests, now]);

    // If the request is allowed, proceed to the actual handler
    return handler(req, res);
  };
}
