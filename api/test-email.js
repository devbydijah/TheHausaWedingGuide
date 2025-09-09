// Test email sender for verifying Resend delivery without Paystack
// Usage:
//   GET /api/test-email?to=user@example.com&token=YOUR_TEST_EMAIL_TOKEN
// Optional:
//   &link=https://your-site/?download=...&expires=...
// Requires env:
//   TEST_EMAIL_TOKEN (shared secret to authorize this endpoint)
//   RESEND_API_KEY   (Resend API key)
//   FROM_EMAIL       (verified sender)

import { sendDownloadEmail } from "../lib/email.js";

const PUBLIC_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Robust query parsing (works even if req.query is unavailable)
    const origin = req.headers.host?.startsWith("localhost")
      ? "http://" + req.headers.host
      : "https://" + req.headers.host;
    const u = new URL(req.url, origin);
    const to = u.searchParams.get("to");
    const token = u.searchParams.get("token");
    const providedLink = u.searchParams.get("link");

    const shared = process.env.TEST_EMAIL_TOKEN;
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const missing = [];
    if (!shared) missing.push("TEST_EMAIL_TOKEN");
    if (!resendKey) missing.push("RESEND_API_KEY");
    if (!fromEmail) missing.push("FROM_EMAIL");
    if (missing.length) {
      return res.status(500).json({
        ok: false,
        error: "Missing required environment variables",
        missing,
        hint: "Set these in Vercel → Project → Settings → Environment Variables, then redeploy.",
      });
    }
    if (!token || token !== shared) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (!to) {
      return res.status(400).json({ error: "Missing 'to' query parameter" });
    }

    // Build a default 24h link if none provided
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const fallbackLink = `${PUBLIC_BASE_URL}?download=test-${Date.now()}&expires=${expires}&email=${encodeURIComponent(
      to
    )}`;
    const downloadLink = providedLink || fallbackLink;

    try {
      await sendDownloadEmail(to, downloadLink);
      return res.status(200).json({
        ok: true,
        to,
        downloadLink,
        message: "Email dispatched via Resend.",
      });
    } catch (e) {
      return res.status(500).json({
        ok: false,
        error: e?.message || String(e),
        hint: "Verify RESEND_API_KEY is valid, FROM_EMAIL is a verified sender/domain in Resend, and check Resend Logs.",
      });
    }
  } catch (err) {
    console.error("/api/test-email error:", err);
    return res.status(500).json({
      ok: false,
      error: err?.message || "Internal server error",
    });
  }
}
