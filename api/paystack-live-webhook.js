// Paystack LIVE Webhook Handler
// Handles LIVE production payments and sends emails via Resend

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import {
  sendDownloadEmail,
  sendWebAppAccessEmail,
  sendBundleEmail,
} from "../lib/email.js";
import { tokenDB } from "../lib/database.cjs";

// Environment variables
const PAYSTACK_LIVE_SECRET =
  process.env.PAYSTACK_LIVE_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY;

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

// Product IDs - will be detected from metadata or amount
const PDF_PRODUCT_ID = 2148110;
const WEBAPP_PRODUCT_ID = 2183417;

/**
 * Verify Paystack webhook signature (LIVE MODE ONLY)
 */
function verifySignature(rawBodyString, signature) {
  if (!signature) {
    console.log("[LIVE-WEBHOOK] ❌ No signature provided");
    return false;
  }

  if (!PAYSTACK_LIVE_SECRET) {
    console.log("[LIVE-WEBHOOK] ❌ PAYSTACK_LIVE_SECRET_KEY not configured");
    return false;
  }

  const hmac = crypto.createHmac("sha512", PAYSTACK_LIVE_SECRET);
  hmac.update(rawBodyString);
  const digest = hmac.digest("hex");
  const isValid = digest === signature;

  console.log("[LIVE-WEBHOOK] 🔐 Signature valid:", isValid);
  return isValid;
}

/**
 * Main LIVE webhook handler
 */
export default async function handler(req, res) {
  console.log("\n========================================");
  console.log("[LIVE-WEBHOOK] 🎯 Paystack LIVE webhook received!");
  console.log("[LIVE-WEBHOOK] 📅 Time:", new Date().toISOString());
  console.log("[LIVE-WEBHOOK] 🔧 Method:", req.method);

  if (req.method !== "POST") {
    console.log("[LIVE-WEBHOOK] ❌ Invalid method");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get raw body for signature verification
  let rawBody = "";
  if (req.body) {
    rawBody =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }
  console.log("[LIVE-WEBHOOK] 📦 Raw body length:", rawBody.length);

  // Verify webhook signature
  const signature = req.headers["x-paystack-signature"];
  console.log(
    "[LIVE-WEBHOOK] 🔐 Signature received:",
    signature ? "YES" : "NO"
  );

  const isValid = verifySignature(rawBody, signature);

  if (!isValid) {
    console.error("[LIVE-WEBHOOK] ❌ Invalid signature - Verification FAILED");
    console.error(
      "[LIVE-WEBHOOK] ❌ PAYSTACK_LIVE_SECRET exists:",
      !!PAYSTACK_LIVE_SECRET
    );
    return res.status(401).json({ error: "Invalid signature" });
  }

  console.log("[LIVE-WEBHOOK] ✅ Signature verified (LIVE MODE - PRODUCTION)");

  // Parse webhook data
  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (error) {
    console.error("[LIVE-WEBHOOK] ❌ Invalid JSON:", error);
    return res.status(400).json({ error: "Invalid JSON" });
  }

  console.log("[LIVE-WEBHOOK] 📋 Event type:", data.event);

  // Only process successful charges
  if (data.event !== "charge.success") {
    console.log(`[LIVE-WEBHOOK] ℹ️ Ignoring event: ${data.event}`);
    return res.status(200).json({ received: true });
  }

  const eventData = data.data;
  const customerEmail = eventData.customer?.email;
  const amount = eventData.amount;
  const txReference = eventData.reference;
  const metadata = eventData.metadata || {};

  console.log("[LIVE-WEBHOOK] ==========================================");
  console.log("[LIVE-WEBHOOK] 🎉 CHARGE SUCCESS EVENT!");
  console.log(`[LIVE-WEBHOOK] 💰 Amount: ₦${(amount / 100).toFixed(2)}`);
  console.log(`[LIVE-WEBHOOK] 📧 Customer Email: ${customerEmail}`);
  console.log(`[LIVE-WEBHOOK] 🔖 Reference: ${txReference}`);
  console.log("[LIVE-WEBHOOK] 📦 Metadata:", JSON.stringify(metadata, null, 2));

  // Validate email
  if (!customerEmail || !customerEmail.includes("@")) {
    console.error("[LIVE-WEBHOOK] ❌ Invalid customer email");
    return res.status(400).json({ error: "Invalid customer email" });
  }

  // Detect product type by amount (since Paystack Storefront may not send product_id)
  const productId = metadata.product_id;
  console.log("[LIVE-WEBHOOK] 🔍 Product ID from metadata:", productId);
  console.log("[LIVE-WEBHOOK] 🔍 Amount (kobo):", amount);

  let productType;

  // Primary detection: by amount (most reliable for Paystack Storefront)
  if (amount >= 100000) {
    // ≥ NGN 1,000 = PDF
    productType = "pdf";
    console.log(
      "[LIVE-WEBHOOK] ✅ Detected product: PDF GUIDE (by amount ≥ NGN 1,000)"
    );
  } else if (amount >= 10000) {
    // ≥ NGN 100 = Web App
    productType = "webapp";
    console.log(
      "[LIVE-WEBHOOK] ✅ Detected product: WEB APP (by amount ≥ NGN 100)"
    );
  } else {
    // Fallback to product_id if available
    if (
      productId === PDF_PRODUCT_ID ||
      String(productId) === String(PDF_PRODUCT_ID)
    ) {
      productType = "pdf";
      console.log(
        "[LIVE-WEBHOOK] ✅ Detected product: PDF GUIDE (by product_id)"
      );
    } else if (
      productId === WEBAPP_PRODUCT_ID ||
      String(productId) === String(WEBAPP_PRODUCT_ID)
    ) {
      productType = "webapp";
      console.log(
        "[LIVE-WEBHOOK] ✅ Detected product: WEB APP (by product_id)"
      );
    } else {
      productType = "webapp"; // Default to webapp for low amounts
      console.warn(
        `[LIVE-WEBHOOK] ⚠️ Could not detect product, defaulting to: ${productType}`
      );
    }
  }

  console.log(
    `[LIVE-WEBHOOK] 📦 FINAL PRODUCT TYPE: ${productType.toUpperCase()}`
  );

  try {
    console.log("[LIVE-WEBHOOK] 🔍 Starting bundle detection...");

    // Check if user already has the other product (bundle detection)
    let hasPdfPurchase = false;
    let hasWebappPurchase = false;

    if (supabaseAdmin) {
      console.log("[LIVE-WEBHOOK] ✅ Supabase admin client available");

      // Check PDF purchase
      const pdfTokens = tokenDB.getTokensByEmail(customerEmail);
      hasPdfPurchase = pdfTokens && pdfTokens.length > 0;
      console.log("[LIVE-WEBHOOK] 📄 Has PDF purchase:", hasPdfPurchase);

      // Check webapp purchase
      const { data: webappUser } = await supabaseAdmin
        .from("web_app_users")
        .select("email")
        .eq("email", customerEmail)
        .single();
      hasWebappPurchase = !!webappUser;
      console.log("[LIVE-WEBHOOK] 🌐 Has WebApp purchase:", hasWebappPurchase);
    } else {
      console.warn("[LIVE-WEBHOOK] ⚠️ Supabase admin client NOT available");
    }

    // Determine if this is a bundle purchase
    const isBundlePurchase =
      (productType === "pdf" && hasWebappPurchase) ||
      (productType === "webapp" && hasPdfPurchase);

    console.log("[LIVE-WEBHOOK] 🎁 Bundle check result:", isBundlePurchase);
    console.log("[LIVE-WEBHOOK] ==========================================");

    // === HANDLE BUNDLE PURCHASE ===
    if (isBundlePurchase) {
      console.log(
        `[LIVE-WEBHOOK] 🎁🎁 BUNDLE PURCHASE DETECTED for ${customerEmail}!`
      );
      console.log("[LIVE-WEBHOOK] 📧 Preparing to send BUNDLE email...");

      // Generate or retrieve PDF download link
      let downloadLink;

      if (productType === "pdf") {
        // Just purchased PDF, generate new token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = Date.now() + 24 * 60 * 60 * 1000;
        const SECRET =
          process.env.DOWNLOAD_TOKEN_SECRET || PAYSTACK_LIVE_SECRET;

        const hmac = crypto.createHmac("sha256", SECRET);
        hmac.update(`${token}|${customerEmail}|${expires}`);
        const sig = hmac.digest("hex");

        tokenDB.storeToken(customerEmail, token, expires, 3);
        downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
          customerEmail
        )}&sig=${sig}`;
      } else {
        // Just purchased webapp, retrieve existing PDF token
        const existingTokens = tokenDB.getTokensByEmail(customerEmail);
        if (existingTokens && existingTokens.length > 0) {
          const existingToken = existingTokens[0];
          const SECRET =
            process.env.DOWNLOAD_TOKEN_SECRET || PAYSTACK_LIVE_SECRET;

          const hmac = crypto.createHmac("sha256", SECRET);
          hmac.update(
            `${existingToken.token}|${customerEmail}|${existingToken.expires_at}`
          );
          const sig = hmac.digest("hex");

          downloadLink = `${PDF_BASE_URL}?download=${existingToken.token}&expires=${existingToken.expires_at}&email=${encodeURIComponent(
            customerEmail
          )}&sig=${sig}`;
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
          console.log(
            `[LIVE-WEBHOOK] ✅ Created webapp user: ${customerEmail}`
          );
        } catch (error) {
          console.error(
            "[LIVE-WEBHOOK] ⚠️ Failed to create webapp user:",
            error.message
          );
        }
      }

      // Send bundle email
      console.log("[LIVE-WEBHOOK] 📤 Calling sendBundleEmail()...");
      console.log("[LIVE-WEBHOOK] 📤 Email:", customerEmail);
      console.log(
        "[LIVE-WEBHOOK] 📤 Download link:",
        downloadLink ? "YES" : "NO"
      );
      console.log("[LIVE-WEBHOOK] 📤 Reference:", txReference);

      try {
        await sendBundleEmail(
          customerEmail,
          downloadLink,
          txReference,
          hasExistingAccount
        );
        console.log(
          `[LIVE-WEBHOOK] ✅✅ Bundle email sent SUCCESSFULLY to: ${customerEmail}`
        );
      } catch (emailError) {
        console.error("[LIVE-WEBHOOK] ❌❌ sendBundleEmail() FAILED!");
        console.error("[LIVE-WEBHOOK] ❌ Error:", emailError);
        console.error("[LIVE-WEBHOOK] ❌ Error message:", emailError.message);
        console.error("[LIVE-WEBHOOK] ❌ Error stack:", emailError.stack);
      }

      return res.status(200).json({ received: true, product: "bundle" });
    }

    // === HANDLE WEB APP PURCHASE ===
    if (productType === "webapp") {
      console.log("[LIVE-WEBHOOK] 🌐 Processing WEB APP purchase...");

      // Create webapp user in Supabase
      if (supabaseAdmin) {
        try {
          const { data: existingUser } = await supabaseAdmin
            .from("web_app_users")
            .select("email")
            .eq("email", customerEmail)
            .single();

          if (existingUser) {
            console.log(
              `[LIVE-WEBHOOK] ℹ️ User already exists, skipping email: ${customerEmail}`
            );
            return res
              .status(200)
              .json({ received: true, product: "webapp", status: "existing" });
          }

          console.log(
            "[LIVE-WEBHOOK] 📝 Creating new webapp user in Supabase..."
          );
          await supabaseAdmin.from("web_app_users").insert([
            {
              email: customerEmail,
              paystack_reference: txReference,
              payment_amount: amount,
              first_login_at: null,
              expires_at: null,
            },
          ]);

          console.log(
            `[LIVE-WEBHOOK] ✅ Created webapp user: ${customerEmail}`
          );
        } catch (error) {
          console.error(
            "[LIVE-WEBHOOK] ❌ Failed to create webapp user:",
            error
          );
          return res.status(500).json({ error: "Failed to create user" });
        }
      }

      // Send signup email
      console.log("[LIVE-WEBHOOK] 📤 Calling sendWebAppAccessEmail()...");
      console.log("[LIVE-WEBHOOK] 📤 Email:", customerEmail);
      console.log("[LIVE-WEBHOOK] 📤 Reference:", txReference);

      try {
        await sendWebAppAccessEmail(customerEmail, txReference);
        console.log(
          `[LIVE-WEBHOOK] ✅✅ Web app email sent SUCCESSFULLY to: ${customerEmail}`
        );
      } catch (emailError) {
        console.error("[LIVE-WEBHOOK] ❌❌ sendWebAppAccessEmail() FAILED!");
        console.error("[LIVE-WEBHOOK] ❌ Error:", emailError);
        console.error("[LIVE-WEBHOOK] ❌ Error message:", emailError.message);
        console.error("[LIVE-WEBHOOK] ❌ Error stack:", emailError.stack);
      }

      return res.status(200).json({ received: true, product: "webapp" });
    }

    // === HANDLE PDF PURCHASE ===
    if (productType === "pdf") {
      console.log("[LIVE-WEBHOOK] 📄 Processing PDF purchase...");

      // Generate download token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = Date.now() + 24 * 60 * 60 * 1000;
      const SECRET = process.env.DOWNLOAD_TOKEN_SECRET || PAYSTACK_LIVE_SECRET;

      const hmac = crypto.createHmac("sha256", SECRET);
      hmac.update(`${token}|${customerEmail}|${expires}`);
      const sig = hmac.digest("hex");

      // Store token in database
      console.log("[LIVE-WEBHOOK] 💾 Storing download token...");
      const stored = tokenDB.storeToken(customerEmail, token, expires, 3);
      if (!stored) {
        console.error("[LIVE-WEBHOOK] ❌ Failed to store token");
        return res
          .status(500)
          .json({ error: "Failed to create download token" });
      }
      console.log("[LIVE-WEBHOOK] ✅ Token stored successfully");

      const downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
        customerEmail
      )}&sig=${sig}`;
      console.log("[LIVE-WEBHOOK] 🔗 Download link generated");

      // Send download email
      console.log("[LIVE-WEBHOOK] 📤 Calling sendDownloadEmail()...");
      console.log("[LIVE-WEBHOOK] 📤 Email:", customerEmail);
      console.log(
        "[LIVE-WEBHOOK] 📤 Download link:",
        downloadLink ? "YES" : "NO"
      );

      try {
        await sendDownloadEmail(customerEmail, downloadLink);
        console.log(
          `[LIVE-WEBHOOK] ✅✅ PDF email sent SUCCESSFULLY to: ${customerEmail}`
        );
      } catch (emailError) {
        console.error("[LIVE-WEBHOOK] ❌❌ sendDownloadEmail() FAILED!");
        console.error("[LIVE-WEBHOOK] ❌ Error:", emailError);
        console.error("[LIVE-WEBHOOK] ❌ Error message:", emailError.message);
        console.error("[LIVE-WEBHOOK] ❌ Error stack:", emailError.stack);
      }

      return res.status(200).json({ received: true, product: "pdf" });
    }

    console.warn("[LIVE-WEBHOOK] ⚠️ Unknown product type");
    return res.status(400).json({ error: "Unknown product type" });
  } catch (error) {
    console.error("[LIVE-WEBHOOK] ❌❌ FATAL ERROR:", error);
    console.error("[LIVE-WEBHOOK] ❌ Error message:", error.message);
    console.error("[LIVE-WEBHOOK] ❌ Error stack:", error.stack);
    return res.status(500).json({ error: "Internal server error" });
  }
}
