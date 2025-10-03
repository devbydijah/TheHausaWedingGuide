// File: api/debug-log.js
// POST /api/debug-log { action: string, reference?: string, timestamp?: string }
// Simple debug logging endpoint (only logs in development)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Only allow in development/localhost
  const isProduction =
    process.env.VERCEL_URL && !process.env.VERCEL_URL.includes("localhost");
  if (isProduction) {
    return res.status(404).json({ error: "Not found" });
  }

  const { action, reference, timestamp } = req.body;

  console.log("[DEBUG]", {
    action,
    reference,
    timestamp: timestamp || new Date().toISOString(),
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
  });

  res.status(200).json({ logged: true });
}
