// Simple Paystack webhook that sends download links via email using Resend
import crypto from "crypto";
import { sendDownloadEmail } from "./email.js";

// Environment variables
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PUBLIC_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Verify Paystack signature using the raw request body string
function verifySignature(rawBodyString, signature) {
  if (!signature || !PAYSTACK_SECRET) return false;
  const hmac = crypto.createHmac("sha512", PAYSTACK_SECRET);
  hmac.update(rawBodyString);
  const digest = hmac.digest("hex");
  return digest === signature;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify webhook signature
    const signature = req.headers["x-paystack-signature"];
    // Compute raw body string in a resilient way (prefer rawBody when available)
    let rawBodyString;
    if (req.rawBody) {
      rawBodyString = Buffer.isBuffer(req.rawBody)
        ? req.rawBody.toString("utf8")
        : String(req.rawBody);
    } else if (typeof req.body === "string") {
      rawBodyString = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      rawBodyString = req.body.toString("utf8");
    } else {
      rawBodyString = JSON.stringify(req.body || {});
    }

    if (!verifySignature(rawBodyString, signature)) {
      console.log("Invalid signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const { event, data } = req.body;

    // Only process successful payments
    if (event === "charge.success" && data.status === "success") {
      const email = data.customer.email;
      const reference = data.reference;

      console.log("Processing successful payment for:", email);

      // Generate a simple temporary token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Create download URL with token
      const downloadLink = `${PUBLIC_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
        email
      )}`;

      // Send email with download link using Resend
      await sendDownloadEmail(email, downloadLink);

      console.log("Download email sent successfully to:", email);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
