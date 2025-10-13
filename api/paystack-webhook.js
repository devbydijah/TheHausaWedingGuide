// Paystack Webhook Handler - Clean Version
// Handles payment success and sends appropriate emails via Resend

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import {
  sendDownloadEmail,
  sendWebAppAccessEmail,
  sendBundleEmail,
} from "../lib/email.js";
import { tokenDB } from "../lib/database.cjs";

// Environment variables
const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY;
const PAYSTACK_LIVE_SECRET = process.env.PAYSTACK_SECRET_KEY;

// Supabase Admin Client
const supabaseAdmin =
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL
    ? createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    : null;

// Product URLs
const PDF_BASE_URL = "https://the-hausa-weding-guide.vercel.app";

// Product IDs
const PDF_PRODUCT_ID = 2148110;
const WEBAPP_PRODUCT_ID = 2183417;

/**
 * Verify Paystack webhook signature
 */
function verifySignature(rawBodyString, signature) {
  if (!signature) return { ok: false, mode: null };

  const secrets = [
    { key: PAYSTACK_TEST_SECRET, mode: "test" },
    { key: PAYSTACK_LIVE_SECRET, mode: "live" },
  ].filter((s) => !!s.key);

  for (const secret of secrets) {
    const hmac = crypto.createHmac("sha512", secret.key);
    hmac.update(rawBodyString);
    const digest = hmac.digest("hex");
    if (digest === signature) return { ok: true, mode: secret.mode };
  }

  return { ok: false, mode: null };
}

/**
 * Main webhook handler
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get raw body for signature verification
  let rawBody = "";
  if (req.body) {
    rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  // Verify webhook signature
  const signature = req.headers["x-paystack-signature"];
  const verification = verifySignature(rawBody, signature);

  if (!verification.ok) {
    console.error("[WEBHOOK] ❌ Invalid signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  console.log(`[WEBHOOK] ✅ Signature verified (${verification.mode} mode)`);

  // Parse webhook data
  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (error) {
    console.error("[WEBHOOK] ❌ Invalid JSON:", error);
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Only process successful charges
  if (data.event !== "charge.success") {
    console.log(`[WEBHOOK] ℹ️ Ignoring event: ${data.event}`);
    return res.status(200).json({ received: true });
  }

  const eventData = data.data;
  const customerEmail = eventData.customer?.email;
  const amount = eventData.amount;
  const txReference = eventData.reference;
  const metadata = eventData.metadata || {};

  console.log(`[WEBHOOK] 💰 Payment received: ₦${(amount / 100).toFixed(2)} from ${customerEmail}`);

  // Validate email
  if (!customerEmail || !customerEmail.includes("@")) {
    console.error("[WEBHOOK] ❌ Invalid customer email");
    return res.status(400).json({ error: "Invalid customer email" });
  }

  // Detect product type
  const productId = metadata.product_id;
  let productType;

  if (productId === PDF_PRODUCT_ID || productId === "2148110") {
    productType = "pdf";
  } else if (productId === WEBAPP_PRODUCT_ID || productId === "2183417") {
    productType = "webapp";
  } else {
    // Fallback: detect by amount
    productType = amount >= 10000 ? "pdf" : "webapp";
    console.warn(`[WEBHOOK] ⚠️ Product ID not found, using amount-based detection: ${productType}`);
  }

  console.log(`[WEBHOOK] 📦 Product: ${productType.toUpperCase()} | Product ID: ${productId || "N/A"}`);

  try {
    // Check if user already has the other product (bundle detection)
    let hasPdfPurchase = false;
    let hasWebappPurchase = false;

    if (supabaseAdmin) {
      // Check PDF purchase
      const pdfTokens = tokenDB.getTokensByEmail(customerEmail);
      hasPdfPurchase = pdfTokens && pdfTokens.length > 0;

      // Check webapp purchase
      const { data: webappUser } = await supabaseAdmin
        .from("web_app_users")
        .select("email")
        .eq("email", customerEmail)
        .single();
      hasWebappPurchase = !!webappUser;
    }

    // Determine if this is a bundle purchase
    const isBundlePurchase =
      (productType === "pdf" && hasWebappPurchase) ||
      (productType === "webapp" && hasPdfPurchase);

    console.log(`[WEBHOOK] 🔍 Bundle check: PDF=${hasPdfPurchase}, Webapp=${hasWebappPurchase}, IsBundle=${isBundlePurchase}`);

    // === HANDLE BUNDLE PURCHASE ===
    if (isBundlePurchase) {
      console.log(`[WEBHOOK] 🎁 Bundle detected for ${customerEmail}`);

      // Generate or retrieve PDF download link
      let downloadLink;
      
      if (productType === "pdf") {
        // Just purchased PDF, generate new token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY;
        
        const hmac = crypto.createHmac("sha256", SECRET);
        hmac.update(`${token}|${customerEmail}|${expires}`);
        const sig = hmac.digest("hex");

        tokenDB.storeToken(customerEmail, token, expires, 3);
        downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(customerEmail)}&sig=${sig}`;
      } else {
        // Just purchased webapp, retrieve existing PDF token
        const existingTokens = tokenDB.getTokensByEmail(customerEmail);
        if (existingTokens && existingTokens.length > 0) {
          const existingToken = existingTokens[0];
          const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY;
          
          const hmac = crypto.createHmac("sha256", SECRET);
          hmac.update(`${existingToken.token}|${customerEmail}|${existingToken.expires_at}`);
          const sig = hmac.digest("hex");

          downloadLink = `${PDF_BASE_URL}?download=${existingToken.token}&expires=${existingToken.expires_at}&email=${encodeURIComponent(customerEmail)}&sig=${sig}`;
        }
      }

      // Create webapp user if needed
      let hasExistingAccount = hasWebappPurchase;
      if (productType === "webapp" && !hasWebappPurchase && supabaseAdmin) {
        try {
          await supabaseAdmin.from("web_app_users").insert([
            {
              email: customerEmail,
              paystack_reference: txReference,
              payment_amount: amount,
              first_login_at: null,
              expires_at: null,
            },
          ]);
          console.log(`[WEBHOOK] ✅ Created webapp user: ${customerEmail}`);
        } catch (error) {
          console.error("[WEBHOOK] ⚠️ Failed to create webapp user:", error.message);
        }
      }

      // Send bundle email
      await sendBundleEmail(customerEmail, downloadLink, txReference, hasExistingAccount);
      console.log(`[WEBHOOK] ✅ Bundle email sent to: ${customerEmail}`);

      return res.status(200).json({ received: true, product: "bundle" });
    }

    // === HANDLE WEB APP PURCHASE ===
    if (productType === "webapp") {
      // Create webapp user in Supabase
      if (supabaseAdmin) {
        try {
          const { data: existingUser } = await supabaseAdmin
            .from("web_app_users")
            .select("email")
            .eq("email", customerEmail)
            .single();

          if (existingUser) {
            console.log(`[WEBHOOK] ℹ️ User already exists, skipping email: ${customerEmail}`);
            return res.status(200).json({ received: true, product: "webapp", status: "existing" });
          }

          await supabaseAdmin.from("web_app_users").insert([
            {
              email: customerEmail,
              paystack_reference: txReference,
              payment_amount: amount,
              first_login_at: null,
              expires_at: null,
            },
          ]);

          console.log(`[WEBHOOK] ✅ Created webapp user: ${customerEmail}`);
        } catch (error) {
          console.error("[WEBHOOK] ❌ Failed to create webapp user:", error);
          return res.status(500).json({ error: "Failed to create user" });
        }
      }

      // Send signup email
      await sendWebAppAccessEmail(customerEmail, txReference);
      console.log(`[WEBHOOK] ✅ Web app email sent to: ${customerEmail}`);

      return res.status(200).json({ received: true, product: "webapp" });
    }

    // === HANDLE PDF PURCHASE ===
    if (productType === "pdf") {
      // Generate download token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY;

      const hmac = crypto.createHmac("sha256", SECRET);
      hmac.update(`${token}|${customerEmail}|${expires}`);
      const sig = hmac.digest("hex");

      // Store token in database
      const stored = tokenDB.storeToken(customerEmail, token, expires, 3);
      if (!stored) {
        console.error("[WEBHOOK] ❌ Failed to store token");
        return res.status(500).json({ error: "Failed to create download token" });
      }

      const downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(customerEmail)}&sig=${sig}`;

      // Send download email
      await sendDownloadEmail(customerEmail, downloadLink);
      console.log(`[WEBHOOK] ✅ PDF email sent to: ${customerEmail}`);

      return res.status(200).json({ received: true, product: "pdf" });
    }

    // Unknown product type
    console.error("[WEBHOOK] ❌ Unknown product type");
    return res.status(400).json({ error: "Unknown product type" });

  } catch (error) {
    console.error("[WEBHOOK] ❌ Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
