// /api/paystack-webhook.js

import crypto from "crypto";
import {
  sendDownloadEmail,
  sendWebAppAccessEmail,
  sendBundleEmail,
} from "./email.js";

// Environment variables
const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY;
const PAYSTACK_LIVE_SECRET = process.env.PAYSTACK_LIVE_SECRET_KEY; // Changed from PAYSTACK_SECRET_KEY
// --- FIX: Use the production URL for all email links ---
const BASE_URL = "https://the-hausa-weding-guide.vercel.app";
const DOWNLOAD_TOKEN_SECRET_TEST = process.env.DOWNLOAD_TOKEN_SECRET_TEST;
const DOWNLOAD_TOKEN_SECRET_LIVE = process.env.DOWNLOAD_TOKEN_SECRET_LIVE;

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
  console.log("[WEBHOOK] 🎯 Paystack webhook received!");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = JSON.stringify(req.body);
  const signature = req.headers["x-paystack-signature"];
  const { isValid, mode } = verifySignature(rawBody, signature);

  if (!isValid) {
    console.error("[WEBHOOK] ❌ Invalid signature.");
    return res.status(401).json({ error: "Invalid signature" });
  }

  console.log(`[WEBHOOK] ✅ Signature verified. Mode: ${mode.toUpperCase()}`);

  const event = req.body;
  if (event.event !== "charge.success") {
    return res.status(200).json({ received: true });
  }

  const { customer, amount, reference } = event.data;

  if (!customer || !customer.email) {
    console.error("[WEBHOOK] ❌ Invalid customer email.");
    return res.status(400).json({ error: "Invalid customer email" });
  }

  const firstName = customer.first_name || "";
  const email = customer.email;
  console.log(`[WEBHOOK] 🎉 Processing successful charge for ${email}`);

  // --- **UPDATED**: Prices in Kobo (Test and Live) ---
  // Test prices
  const pdfAmountKobo_Test = 999000; // ₦9,990.00 (PDF Test)
  const webAppAmountKobo_Test = 10000; // ₦100.00 (Web App Test)
  const bundleAmountKobo_Test = 12000; // ₦120.00 (Bundle Test)

  // Live prices
  const pdfAmountKobo_Live = 999000; // ₦9,990.00 (PDF Live)
  const webAppAmountKobo_Live = 10000; // ₦100.00 (Web App Live - Coming Soon)
  const bundleAmountKobo_Live = 12000; // ₦120.00 (Bundle Live - Coming Soon)

  // --- DETERMINE PRODUCT TYPE ---
  // PRIORITIZE product name/description over amount (to handle discount codes)
  let productType = null;

  // Extract product information from Paystack data
  const data = event.data;
  const metadata = data.metadata || {};
  const productName =
    metadata.product_name ||
    data.description ||
    metadata.custom_fields?.product_name ||
    data.plan ||
    "";
  const productNameLower = productName.toLowerCase();

  console.log(`[WEBHOOK] 🔍 Determining product type...`);
  console.log(`[WEBHOOK]    Amount: ${amount} kobo (₦${amount / 100})`);
  console.log(`[WEBHOOK]    Product name: "${productName}"`);
  console.log(`[WEBHOOK]    Mode: ${mode}`);
  console.log(`[WEBHOOK]    Full metadata: ${JSON.stringify(metadata)}`);

  // FIRST: Check product name/description (most reliable)
  // Exact product name on Paystack: "Northern Wedding Guide(by HausaRoom)"
  if (
    productNameLower.includes("northern wedding guide") ||
    productNameLower.includes("northern-wedding-guide") ||
    productNameLower.includes("hausaroom") ||
    productNameLower.includes("hausa room") ||
    productNameLower.includes("pdf")
  ) {
    productType = "pdf";
    console.log(
      `[WEBHOOK] ✅ Identified as PDF Guide (by product name: "${productName}")`
    );
  } else if (
    productNameLower.includes("bundle") ||
    productNameLower.includes("complete package")
  ) {
    productType = "bundle";
    console.log(`[WEBHOOK] ✅ Identified as Bundle Deal (by product name)`);
  } else if (
    productNameLower.includes("interactive") ||
    productNameLower.includes("web app") ||
    productNameLower.includes("webapp")
  ) {
    productType = "webapp";
    console.log(
      `[WEBHOOK] ✅ Identified as Interactive Guide (by product name)`
    );
  }
  // FALLBACK: Check amount if product name didn't match
  else if (mode === "test") {
    if (amount === pdfAmountKobo_Test) {
      productType = "pdf";
      console.log(`[WEBHOOK] ✅ Identified as PDF Guide (by test amount)`);
    } else if (amount === bundleAmountKobo_Test) {
      productType = "bundle";
      console.log(`[WEBHOOK] ✅ Identified as Bundle Deal (by test amount)`);
    } else if (amount === webAppAmountKobo_Test) {
      productType = "webapp";
      console.log(
        `[WEBHOOK] ✅ Identified as Interactive Guide (by test amount)`
      );
    }
  } else if (mode === "live") {
    if (amount === pdfAmountKobo_Live) {
      productType = "pdf";
      console.log(`[WEBHOOK] ✅ Identified as PDF Guide (by live amount)`);
    } else if (amount === bundleAmountKobo_Live) {
      productType = "bundle";
      console.log(`[WEBHOOK] ✅ Identified as Bundle Deal (by live amount)`);
    } else if (amount === webAppAmountKobo_Live) {
      productType = "webapp";
      console.log(
        `[WEBHOOK] ✅ Identified as Interactive Guide (by live amount)`
      );
    }
  }

  if (!productType) {
    console.error(
      `[WEBHOOK] ❌ Could not identify product type. Amount: ${amount} kobo, Mode: ${mode}, Product name: "${productName}", Metadata: ${JSON.stringify(metadata)}`
    );
    return res.status(200).json({
      received: true,
      warning: "Unrecognized amount and product name, no product email sent.",
    });
  }

  console.log(`[WEBHOOK] 📦 Determined product: ${productType.toUpperCase()}`);

  try {
    let downloadLink = null;
    let signupUrl = null;

    // --- **FIX**: Generate PDF link (if needed) & pass mode ---
    if (productType === "pdf" || productType === "bundle") {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      const SECRET =
        mode === "live"
          ? DOWNLOAD_TOKEN_SECRET_LIVE
          : DOWNLOAD_TOKEN_SECRET_TEST;
      if (!SECRET) throw new Error("Download token secret missing.");
      const hmac = crypto.createHmac("sha256", SECRET);
      hmac.update(`${token}|${email}|${expires}`);
      const sig = hmac.digest("hex");

      // --- ADDED &mode=${mode} ---
      downloadLink = `${BASE_URL}/api/pdf-download?token=${token}&expires=${expires}&email=${encodeURIComponent(email)}&sig=${sig}&mode=${mode}`;
    }

    // Generate Web App link (if needed)
    if (productType === "webapp" || productType === "bundle") {
      signupUrl = `${BASE_URL}/?guide=1&email=${encodeURIComponent(email)}`;
    }

    // Call the correct email function
    if (productType === "pdf") {
      await sendDownloadEmail(email, firstName, downloadLink);
      console.log(`[WEBHOOK] ✅ PDF email sent to ${email}`);
    } else if (productType === "webapp") {
      await sendWebAppAccessEmail(email, firstName, reference); // This function correctly generates the signupUrl internally
      console.log(`[WEBHOOK] ✅ Web App email sent to ${email}`);
    } else if (productType === "bundle") {
      if (!downloadLink || !signupUrl)
        throw new Error("Failed to generate links for bundle email.");
      await sendBundleEmail(
        email,
        firstName,
        reference,
        downloadLink,
        signupUrl
      );
      console.log(`[WEBHOOK] ✅ Bundle email sent to ${email}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK] ❌❌ FATAL ERROR:", error.message);
    console.error(error.stack);
    return res
      .status(500)
      .json({ error: "Internal server error during processing" });
  }
}
