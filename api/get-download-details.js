// File: api/get-download-details.js
// POST /api/get-download-details { reference: string }
// Returns download details for a valid Paystack reference
import crypto from "crypto";
import { tokenDB } from "../lib/database.cjs";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { reference } = req.body;
  if (!reference) {
    return res.status(400).json({ error: "Reference is required" });
  }

  try {
    // Verify the transaction with Paystack
    const secrets = [PAYSTACK_SECRET, PAYSTACK_TEST_SECRET].filter(Boolean);
    let transactionData = null;

    for (const secret of secrets) {
      try {
        const response = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
          {
            headers: {
              Authorization: `Bearer ${secret}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          transactionData = await response.json();
          if (
            transactionData.status &&
            transactionData.data?.status === "success"
          ) {
            break;
          }
        }
      } catch (error) {
        console.error("Paystack API error:", error);
      }
    }

    if (!transactionData || transactionData.data?.status !== "success") {
      return res
        .status(404)
        .json({ error: "Payment not found or not successful" });
    }

    const email = transactionData.data.customer.email;

    // Check if we already have a token for this email
    const existingToken = tokenDB.getTokenByEmail(email);
    if (existingToken && existingToken.downloads_remaining > 0) {
      // Return existing token details
      const expires = existingToken.expires_at;
      const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || PAYSTACK_SECRET;
      const hmac = crypto.createHmac("sha256", SECRET);
      hmac.update(`${existingToken.token}|${email}|${expires}`);
      const sig = hmac.digest("hex");

      const downloadUrl = `/?download=${existingToken.token}&expires=${expires}&email=${encodeURIComponent(email)}&sig=${sig}`;

      return res.status(200).json({
        ok: true,
        password: existingToken.token.substring(0, 8), // First 8 chars as display password
        download_url: downloadUrl,
      });
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    tokenDB.saveToken(email, token, expires);

    // Generate signed URL
    const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || PAYSTACK_SECRET;
    const hmac = crypto.createHmac("sha256", SECRET);
    hmac.update(`${token}|${email}|${expires}`);
    const sig = hmac.digest("hex");

    const downloadUrl = `/?download=${token}&expires=${expires}&email=${encodeURIComponent(email)}&sig=${sig}`;

    res.status(200).json({
      ok: true,
      password: token.substring(0, 8), // First 8 chars as display password
      download_url: downloadUrl,
    });
  } catch (error) {
    console.error("get-download-details error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
