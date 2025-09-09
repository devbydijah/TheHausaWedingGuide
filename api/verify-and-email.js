// Verify a Paystack transaction by reference and send the download email.
// Usage: POST /api/verify-and-email { reference: string }
// This enables a redirect-based flow: set Paystack Storefront "Redirect after payment"
// to https://YOUR_SITE/?claim=1 and ask the buyer to paste their reference.

import crypto from "crypto";
import { sendDownloadEmail } from "../lib/email.js";

const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY || null;
const PAYSTACK_LIVE_SECRET = process.env.PAYSTACK_SECRET_KEY || null;
const PUBLIC_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

async function verifyWithKey(reference, secretKey) {
  const resp = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(
      reference
    )}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
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
    // Parse body tolerantly
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const reference = body?.reference?.trim();
    if (!reference) {
      return res.status(400).json({ error: "Missing reference" });
    }

    // Try live first, then test, so it works in both modes
    let verified = null;
    let mode = null;

    if (PAYSTACK_LIVE_SECRET) {
      const { ok, json } = await verifyWithKey(reference, PAYSTACK_LIVE_SECRET);
      if (ok && json?.data?.status === "success") {
        verified = json?.data;
        mode = "live";
      }
    }
    if (!verified && PAYSTACK_TEST_SECRET) {
      const { ok, json } = await verifyWithKey(reference, PAYSTACK_TEST_SECRET);
      if (ok && json?.data?.status === "success") {
        verified = json?.data;
        mode = "test";
      }
    }

    if (!verified) {
      return res.status(400).json({ error: "Verification failed" });
    }

    const email = verified?.customer?.email;
    if (!email) {
      return res
        .status(400)
        .json({ error: "No customer email found on transaction" });
    }

    // Generate token + link (24h)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 24 * 60 * 60 * 1000;
    const downloadLink = `${PUBLIC_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
      email
    )}`;

    await sendDownloadEmail(email, downloadLink);

    return res.status(200).json({ ok: true, email, mode, downloadLink });
  } catch (err) {
    console.error("/api/verify-and-email error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
