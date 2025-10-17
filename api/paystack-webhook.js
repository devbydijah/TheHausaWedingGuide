// paystack-webhook.js

import crypto from "crypto";
import { sendDownloadEmail, sendWebAppAccessEmail } from "./email.js"; 

// Environment variables
const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY;
const PAYSTACK_LIVE_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PDF_BASE_URL = "https://the-hausa-weding-guide.vercel.app";

function verifySignature(rawBody, signature) {
  if (!signature) return { isValid: false };

  if (PAYSTACK_LIVE_SECRET) {
    const hmac_live = crypto.createHmac("sha512", PAYSTACK_LIVE_SECRET);
    hmac_live.update(rawBody);
    if (hmac_live.digest("hex") === signature) {
      return { isValid: true, mode: "live" };
    }
  }

  if (PAYSTACK_TEST_SECRET) {
    const hmac_test = crypto.createHmac("sha512", PAYSTACK_TEST_SECRET);
    hmac_test.update(rawBody);
    if (hmac_test.digest("hex") === signature) {
      return { isValid: true, mode: "test" };
    }
  }

  return { isValid: false };
}

export default async function handler(req, res) {
  console.log("========================================");
  console.log("[WEBHOOK] 🎯 Paystack webhook received!");

  if (req.method !== "POST") {
    console.log("[WEBHOOK] ❌ Method not allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = JSON.stringify(req.body);
  const signature = req.headers["x-paystack-signature"];

  const { isValid, mode } = verifySignature(rawBody, signature);

  if (!isValid) {
    console.error("[WEBHOOK] ❌ Invalid signature - Verification FAILED.");
    return res.status(401).json({ error: "Invalid signature" });
  }

  console.log(`[WEBHOOK] ✅ Signature verified. Mode: ${mode.toUpperCase()}`);

  const event = req.body;
  if (event.event !== "charge.success") {
    console.log(`[WEBHOOK] ℹ️ Ignoring event: ${event.event}`);
    return res.status(200).json({ received: true });
  }

  const { customer, amount, reference } = event.data;

  if (!customer || !customer.email) {
    console.error("[WEBHOOK] ❌ Invalid customer email.");
    return res.status(400).json({ error: "Invalid customer email" });
  }

  console.log(
    `[WEBHOOK] 🎉 Processing successful charge for ${customer.email}`
  );

  const productType = amount >= 100000 ? "pdf" : "webapp";

  console.log(`[WEBHOOK] 📦 Detected product: ${productType.toUpperCase()}`);

  try {
    if (productType === "pdf") {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      const SECRET =
        mode === "live" ? PAYSTACK_LIVE_SECRET : PAYSTACK_TEST_SECRET;

      const hmac = crypto.createHmac("sha256", SECRET);
      hmac.update(`${token}|${customer.email}|${expires}`);
      const sig = hmac.digest("hex");

      const downloadLink = `${PDF_BASE_URL}/api/pdf-download?token=${token}&expires=${expires}&email=${encodeURIComponent(
        customer.email
      )}&sig=${sig}`;

      await sendDownloadEmail(customer.email, downloadLink);
      console.log(
        `[WEBHOOK] ✅ PDF email sent successfully to ${customer.email}`
      );
    } else {
      // webapp
      await sendWebAppAccessEmail(customer.email, reference);
      console.log(
        `[WEBHOOK] ✅ Web App access email sent successfully to ${customer.email}`
      );
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(
      "[WEBHOOK] ❌❌ FATAL ERROR while processing:",
      error.message
    );
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}