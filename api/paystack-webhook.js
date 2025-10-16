import crypto from "crypto";
import { sendDownloadEmail, sendWebAppAccessEmail } from "../lib/email.js";

// Environment variables
const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY;
const PDF_BASE_URL = "https://the-hausa-weding-guide.vercel.app";

// --- REMOVED: All Supabase and tokenDB code ---

/**
 * Verify Paystack webhook signature
 */
function verifySignature(rawBodyString, signature) {
  const hmac = crypto.createHmac("sha512", PAYSTACK_TEST_SECRET);
  hmac.update(rawBodyString);
  const digest = hmac.digest("hex");
  if (digest === signature) return { ok: true, mode: "test" };
  return { ok: false, mode: null };
}

/**
 * Main webhook handler
 */
export default async function handler(req, res) {
  console.log("[WEBHOOK] 🎯 Paystack webhook received!");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Signature verification
  const rawBody =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  const signature = req.headers["x-paystack-signature"];
  const verification = verifySignature(rawBody, signature);

  if (!verification.ok) {
    console.error("[WEBHOOK] ❌ Invalid signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (data.event !== "charge.success") {
    return res.status(200).json({ received: true });
  }

  const eventData = data.data;
  const customerEmail = eventData.customer?.email;
  const amount = eventData.amount;
  const txReference = eventData.reference;

  if (!customerEmail) {
    return res.status(400).json({ error: "Invalid customer email" });
  }

  // Simplified product detection (using amount as fallback)
  const productType = amount >= 10000 ? "pdf" : "webapp";

  try {
    if (productType === "webapp") {
      console.log("[WEBHOOK] 🌐 Processing WEB APP purchase...");
      await sendWebAppAccessEmail(customerEmail, txReference);
      console.log(`[WEBHOOK] ✅✅ Web app email sent to: ${customerEmail}`);
    } else {
      // Default to PDF
      console.log("[WEBHOOK] 📄 Processing PDF purchase...");

      // --- SIMPLIFIED TOKEN GENERATION (no database) ---
      const token = crypto.randomBytes(32).toString("hex");
      const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      const SECRET =
        process.env.DOWNLOAD_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY;

      const hmac = crypto.createHmac("sha256", SECRET);
      hmac.update(`${token}|${customerEmail}|${expires}`);
      const sig = hmac.digest("hex");

      const downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(customerEmail)}&sig=${sig}`;

      await sendDownloadEmail(customerEmail, downloadLink);
      console.log(`[WEBHOOK] ✅✅ PDF email sent to: ${customerEmail}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK] ❌ Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
