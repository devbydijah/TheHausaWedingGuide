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
        hint:
          "Set these in Vercel → Project → Settings → Environment Variables, then redeploy.",
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
        hint:
          "Verify RESEND_API_KEY is valid, FROM_EMAIL is a verified sender/domain in Resend, and check Resend Logs.",
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
// Simple test API that bypasses Paystack verification for debugging
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { sendDownloadEmail } from "./email.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "private";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "email required" });
  }

  try {
    console.log("Testing Resend with email:", email);

    await sendEmail({
      toEmail: email,
      subject: "Resend Test",
      html: "<h2>Test Email</h2><p>If you receive this, Resend is working!</p>",
      text: "Test Email - If you receive this, Resend is working!",
    });

    console.log("Resend test successful");
    return res
      .status(200)
      .json({ ok: true, message: "Test email sent successfully" });
  } catch (error) {
    console.error("Resend test failed:", error);
    return res.status(500).json({
      error: "Resend failed",
      details: error.message,
      status: error.status,
    });
  }
}
