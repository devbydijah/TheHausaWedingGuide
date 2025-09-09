// Verify a Paystack transaction by reference and issue the download link via email
// POST /api/issue-link { reference: string, email?: string }
// Tries live then test key (or vice versa) and sends a Resend email on success

import crypto from "crypto";
import { sendDownloadEmail } from "../lib/email.js";

const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY || null;
const PAYSTACK_LIVE_SECRET = process.env.PAYSTACK_SECRET_KEY || null;
const PUBLIC_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

async function verifyWithKey(reference, key) {
  const resp = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(
      reference
    )}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    }
  );
  const json = await resp.json();
  return { ok: resp.ok, json };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { reference, email: emailHint } = req.body || {};
    if (!reference) {
      return res.status(400).json({ error: "reference is required" });
    }

    if (!PAYSTACK_LIVE_SECRET && !PAYSTACK_TEST_SECRET) {
      return res.status(500).json({ error: "Server not configured" });
    }

    // Try live first, then test (or whichever exists)
    const keys = [PAYSTACK_LIVE_SECRET, PAYSTACK_TEST_SECRET].filter(Boolean);
    let verified = null;
    for (const key of keys) {
      try {
        const { ok, json } = await verifyWithKey(reference, key);
        if (ok && json?.data?.status === "success") {
          verified = json?.data;
          break;
        }
      } catch {}
    }

    if (!verified) {
      return res.status(400).json({ error: "Verification failed" });
    }

    const customerEmail = verified?.customer?.email;
    const targetEmail = emailHint || customerEmail;
    if (!targetEmail) {
      return res.status(400).json({ error: "Customer email unavailable" });
    }

    // Generate link
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24h
    const downloadLink = `${PUBLIC_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
      targetEmail
    )}`;

    // Email link
    await sendDownloadEmail(targetEmail, downloadLink);

    return res.status(200).json({ ok: true, downloadLink, email: targetEmail });
  } catch (e) {
    console.error("/api/issue-link error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
