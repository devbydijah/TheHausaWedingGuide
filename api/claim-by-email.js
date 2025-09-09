// Claim by email: check recent successful Paystack transactions for the provided email,
// then send the download link via Resend. Works for both live and test (tries both keys).
// POST /api/claim-by-email { email: string }

import crypto from "crypto";
import { sendDownloadEmail } from "../lib/email.js";

const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY || null;
const PAYSTACK_LIVE_SECRET = process.env.PAYSTACK_SECRET_KEY || null;
const PUBLIC_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

function normalizeEmail(str) {
  return String(str || "")
    .trim()
    .toLowerCase();
}

async function listRecentSuccessfulTransactions(secretKey) {
  const url = new URL("https://api.paystack.co/transaction");
  url.searchParams.set("status", "success");
  url.searchParams.set("perPage", "50");
  url.searchParams.set("page", "1");
  const resp = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      Accept: "application/json",
    },
  });
  const json = await resp.json();
  if (!resp.ok) {
    throw new Error(`Paystack list error: ${resp.status}`);
  }
  const items = Array.isArray(json?.data) ? json.data : [];
  return items;
}

function parseDateSafe(d) {
  if (!d) return null;
  const t = Date.parse(d);
  return Number.isFinite(t) ? new Date(t) : null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const email = normalizeEmail(body?.email);
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (!PAYSTACK_LIVE_SECRET && !PAYSTACK_TEST_SECRET) {
      return res.status(500).json({ error: "Server not configured" });
    }

    // Try live first then test
    const keys = [PAYSTACK_LIVE_SECRET, PAYSTACK_TEST_SECRET].filter(Boolean);
    let match = null;
    let mode = null;
    for (const [idx, key] of keys.entries()) {
      try {
        const items = await listRecentSuccessfulTransactions(key);
        // Find the most recent success for this email within the last 7 days
        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const filtered = items
          .filter((it) => normalizeEmail(it?.customer?.email) === email)
          .filter((it) => {
            const paidAt = parseDateSafe(
              it?.paid_at || it?.paidAt || it?.createdAt || it?.created_at
            );
            return paidAt && now - paidAt.getTime() <= sevenDaysMs;
          })
          .sort((a, b) => {
            const ta =
              parseDateSafe(
                a?.paid_at || a?.paidAt || a?.createdAt || a?.created_at
              )?.getTime() || 0;
            const tb =
              parseDateSafe(
                b?.paid_at || b?.paidAt || b?.createdAt || b?.created_at
              )?.getTime() || 0;
            return tb - ta; // newest first
          });
        if (filtered.length > 0) {
          match = filtered[0];
          mode = idx === 0 && PAYSTACK_LIVE_SECRET ? "live" : "test";
          break;
        }
      } catch (e) {
        // Continue to next key
      }
    }

    if (!match) {
      return res
        .status(404)
        .json({ error: "No recent successful payment found for this email" });
    }

    // Issue link to the provided email
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 24 * 60 * 60 * 1000;
    const downloadLink = `${PUBLIC_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
      email
    )}`;

    await sendDownloadEmail(email, downloadLink);
    return res.status(200).json({ ok: true, email, mode, downloadLink });
  } catch (e) {
    console.error("/api/claim-by-email error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
