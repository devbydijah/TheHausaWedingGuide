// Paystack TEST Webhook Handler
// This is a copy of the main webhook specifically for test mode
// Handles test payments and sends emails

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
 * Verify Paystack webhook signature (TEST MODE ONLY)
 */
function verifySignature(rawBodyString, signature) {
  if (!signature) {
    console.log("[TEST-WEBHOOK] ❌ No signature provided");
    return false;
  }

  if (!PAYSTACK_TEST_SECRET) {
    console.log("[TEST-WEBHOOK] ❌ PAYSTACK_TEST_SECRET_KEY not configured");
    return false;
  }

  const hmac = crypto.createHmac("sha512", PAYSTACK_TEST_SECRET);
  hmac.update(rawBodyString);
  const digest = hmac.digest("hex");
  const isValid = digest === signature;

  console.log("[TEST-WEBHOOK] 🔐 Signature valid:", isValid);
  return isValid;
}

/**
 * Main test webhook handler
 */
export default async function handler(req, res) {
  console.log("\n========================================");
  console.log("[TEST-WEBHOOK] 🎯 Paystack TEST webhook received!");
  console.log("[TEST-WEBHOOK] 📅 Time:", new Date().toISOString());
  console.log("[TEST-WEBHOOK] 🔧 Method:", req.method);

  if (req.method !== "POST") {
    console.log("[TEST-WEBHOOK] ❌ Invalid method");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get raw body for signature verification
  let rawBody = "";
  if (req.body) {
    rawBody =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }
  console.log("[TEST-WEBHOOK] 📦 Raw body length:", rawBody.length);

  // Verify webhook signature
  const signature = req.headers["x-paystack-signature"];
  console.log(
    "[TEST-WEBHOOK] 🔐 Signature received:",
    signature ? "YES" : "NO"
  );

  const isValid = verifySignature(rawBody, signature);

  if (!isValid) {
    console.error("[TEST-WEBHOOK] ❌ Invalid signature - Verification FAILED");
    return res.status(401).json({ error: "Invalid signature" });
  }

  console.log("[TEST-WEBHOOK] ✅ Signature verified (TEST MODE)");

  // Parse webhook data
  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (error) {
    console.error("[TEST-WEBHOOK] ❌ Invalid JSON:", error);
    return res.status(400).json({ error: "Invalid JSON" });
  }

  console.log("[TEST-WEBHOOK] 📋 Event type:", data.event);

  // Only process successful charges
  if (data.event !== "charge.success") {
    console.log(`[TEST-WEBHOOK] ℹ️ Ignoring event: ${data.event}`);
    return res.status(200).json({ received: true });
  }

  const eventData = data.data;
  const customerEmail = eventData.customer?.email;
  const amount = eventData.amount;
  const txReference = eventData.reference;
  const metadata = eventData.metadata || {};

  console.log("[TEST-WEBHOOK] ==========================================");
  console.log("[TEST-WEBHOOK] 🎉 CHARGE SUCCESS EVENT!");
  console.log(`[TEST-WEBHOOK] 💰 Amount: ₦${(amount / 100).toFixed(2)}`);
  console.log(`[TEST-WEBHOOK] 📧 Customer Email: ${customerEmail}`);
  console.log(`[TEST-WEBHOOK] 🔖 Reference: ${txReference}`);
  console.log("[TEST-WEBHOOK] 📦 Metadata:", JSON.stringify(metadata, null, 2));

  // Validate email
  if (!customerEmail || !customerEmail.includes("@")) {
    console.error("[TEST-WEBHOOK] ❌ Invalid customer email");
    return res.status(400).json({ error: "Invalid customer email" });
  }

  // Detect product type
  const productId = metadata.product_id;
  console.log("[TEST-WEBHOOK] 🔍 Product ID from metadata:", productId);
  console.log("[TEST-WEBHOOK] 🔍 Expected PDF ID:", PDF_PRODUCT_ID);
  console.log("[TEST-WEBHOOK] 🔍 Expected WebApp ID:", WEBAPP_PRODUCT_ID);

  let productType;

  if (
    productId === PDF_PRODUCT_ID ||
    String(productId) === String(PDF_PRODUCT_ID)
  ) {
    productType = "pdf";
    console.log("[TEST-WEBHOOK] ✅ Detected product: PDF GUIDE");
  } else if (
    productId === WEBAPP_PRODUCT_ID ||
    String(productId) === String(WEBAPP_PRODUCT_ID)
  ) {
    productType = "webapp";
    console.log("[TEST-WEBHOOK] ✅ Detected product: WEB APP");
  } else {
    // Fallback: detect by amount
    productType = amount >= 10000 ? "pdf" : "webapp";
    console.warn(
      `[TEST-WEBHOOK] ⚠️ Product ID not found, using amount-based detection: ${productType}`
    );
    console.warn(`[TEST-WEBHOOK] ⚠️ Amount: ${amount} (threshold: 10000)`);
  }

  console.log(
    `[TEST-WEBHOOK] 📦 FINAL PRODUCT TYPE: ${productType.toUpperCase()}`
  );

  try {
    console.log("[TEST-WEBHOOK] 🔍 Starting bundle detection...");

    // Check if user already has the other product (bundle detection)
    let hasPdfPurchase = false;
    let hasWebappPurchase = false;

    if (supabaseAdmin) {
      console.log("[TEST-WEBHOOK] ✅ Supabase admin client available");

      // Check PDF purchase
      const pdfTokens = tokenDB.getTokensByEmail(customerEmail);
      hasPdfPurchase = pdfTokens && pdfTokens.length > 0;
      console.log("[TEST-WEBHOOK] 📄 Has PDF purchase:", hasPdfPurchase);

      // Check webapp purchase
      const { data: webappUser } = await supabaseAdmin
        .from("web_app_users")
        .select("email")
        .eq("email", customerEmail)
        .single();
      hasWebappPurchase = !!webappUser;
      console.log("[TEST-WEBHOOK] 🌐 Has WebApp purchase:", hasWebappPurchase);
    } else {
      console.warn("[TEST-WEBHOOK] ⚠️ Supabase admin client NOT available");
    }

    // Determine if this is a bundle purchase
    const isBundlePurchase =
      (productType === "pdf" && hasWebappPurchase) ||
      (productType === "webapp" && hasPdfPurchase);

    console.log("[TEST-WEBHOOK] 🎁 Bundle check result:", isBundlePurchase);
    console.log("[TEST-WEBHOOK] ==========================================");

    // === HANDLE BUNDLE PURCHASE ===
    if (isBundlePurchase) {
      console.log(
        `[TEST-WEBHOOK] 🎁🎁 BUNDLE PURCHASE DETECTED for ${customerEmail}!`
      );
      console.log("[TEST-WEBHOOK] 📧 Preparing to send BUNDLE email...");

      // Generate or retrieve PDF download link
      let downloadLink;

      if (productType === "pdf") {
        // Just purchased PDF, generate new token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = Date.now() + 24 * 60 * 60 * 1000;
        const SECRET =
          process.env.DOWNLOAD_TOKEN_SECRET ||
          process.env.PAYSTACK_TEST_SECRET_KEY;

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
            process.env.DOWNLOAD_TOKEN_SECRET ||
            process.env.PAYSTACK_TEST_SECRET_KEY;

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
            `[TEST-WEBHOOK] ✅ Created webapp user: ${customerEmail}`
          );
        } catch (error) {
          console.error(
            "[TEST-WEBHOOK] ⚠️ Failed to create webapp user:",
            error.message
          );
        }
      }

      // Send bundle email
      console.log("[TEST-WEBHOOK] 📤 Calling sendBundleEmail()...");
      console.log("[TEST-WEBHOOK] 📤 Email:", customerEmail);
      console.log(
        "[TEST-WEBHOOK] 📤 Download link:",
        downloadLink ? "YES" : "NO"
      );
      console.log("[TEST-WEBHOOK] 📤 Reference:", txReference);

      try {
        await sendBundleEmail(
          customerEmail,
          downloadLink,
          txReference,
          hasExistingAccount
        );
        console.log(
          `[TEST-WEBHOOK] ✅✅ Bundle email sent SUCCESSFULLY to: ${customerEmail}`
        );
      } catch (emailError) {
        console.error("[TEST-WEBHOOK] ❌❌ sendBundleEmail() FAILED!");
        console.error("[TEST-WEBHOOK] ❌ Error:", emailError);
        console.error("[TEST-WEBHOOK] ❌ Error message:", emailError.message);
        console.error("[TEST-WEBHOOK] ❌ Error stack:", emailError.stack);
      }

      return res.status(200).json({ received: true, product: "bundle" });
    }

    // === HANDLE WEB APP PURCHASE ===
    if (productType === "webapp") {
      console.log("[TEST-WEBHOOK] 🌐 Processing WEB APP purchase...");

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
              `[TEST-WEBHOOK] ℹ️ User already exists, skipping email: ${customerEmail}`
            );
            return res
              .status(200)
              .json({ received: true, product: "webapp", status: "existing" });
          }

          console.log(
            "[TEST-WEBHOOK] 📝 Creating new webapp user in Supabase..."
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
            `[TEST-WEBHOOK] ✅ Created webapp user: ${customerEmail}`
          );
        } catch (error) {
          console.error(
            "[TEST-WEBHOOK] ❌ Failed to create webapp user:",
            error
          );
          return res.status(500).json({ error: "Failed to create user" });
        }
      }

      // Send signup email
      console.log("[TEST-WEBHOOK] 📤 Calling sendWebAppAccessEmail()...");
      console.log("[TEST-WEBHOOK] 📤 Email:", customerEmail);
      console.log("[TEST-WEBHOOK] 📤 Reference:", txReference);

      try {
        await sendWebAppAccessEmail(customerEmail, txReference);
        console.log(
          `[TEST-WEBHOOK] ✅✅ Web app email sent SUCCESSFULLY to: ${customerEmail}`
        );
      } catch (emailError) {
        console.error("[TEST-WEBHOOK] ❌❌ sendWebAppAccessEmail() FAILED!");
        console.error("[TEST-WEBHOOK] ❌ Error:", emailError);
        console.error("[TEST-WEBHOOK] ❌ Error message:", emailError.message);
        console.error("[TEST-WEBHOOK] ❌ Error stack:", emailError.stack);
      }

      return res.status(200).json({ received: true, product: "webapp" });
    }

    // === HANDLE PDF PURCHASE ===
    if (productType === "pdf") {
      console.log("[TEST-WEBHOOK] 📄 Processing PDF purchase...");

      // Generate download token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = Date.now() + 24 * 60 * 60 * 1000;
      const SECRET =
        process.env.DOWNLOAD_TOKEN_SECRET ||
        process.env.PAYSTACK_TEST_SECRET_KEY;

      const hmac = crypto.createHmac("sha256", SECRET);
      hmac.update(`${token}|${customerEmail}|${expires}`);
      const sig = hmac.digest("hex");

      // Store token in database
      console.log("[TEST-WEBHOOK] 💾 Storing download token...");
      const stored = tokenDB.storeToken(customerEmail, token, expires, 3);
      if (!stored) {
        console.error("[TEST-WEBHOOK] ❌ Failed to store token");
        return res
          .status(500)
          .json({ error: "Failed to create download token" });
      }
      console.log("[TEST-WEBHOOK] ✅ Token stored successfully");

      const downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
        customerEmail
      )}&sig=${sig}`;
      console.log("[TEST-WEBHOOK] 🔗 Download link generated");

      // Send download email
      console.log("[TEST-WEBHOOK] 📤 Calling sendDownloadEmail()...");
      console.log("[TEST-WEBHOOK] 📤 Email:", customerEmail);
      console.log(
        "[TEST-WEBHOOK] 📤 Download link:",
        downloadLink ? "YES" : "NO"
      );

      try {
        await sendDownloadEmail(customerEmail, downloadLink);
        console.log(
          `[TEST-WEBHOOK] ✅✅ PDF email sent SUCCESSFULLY to: ${customerEmail}`
        );
      } catch (emailError) {
        console.error("[TEST-WEBHOOK] ❌❌ sendDownloadEmail() FAILED!");
        console.error("[TEST-WEBHOOK] ❌ Error:", emailError);
        console.error("[TEST-WEBHOOK] ❌ Error message:", emailError.message);
        console.error("[TEST-WEBHOOK] ❌ Error stack:", emailError.stack);
      }

      return res.status(200).json({ received: true, product: "pdf" });
    }

    console.warn("[TEST-WEBHOOK] ⚠️ Unknown product type");
    return res.status(400).json({ error: "Unknown product type" });
  } catch (error) {
    console.error("[TEST-WEBHOOK] ❌❌ FATAL ERROR:", error);
    console.error("[TEST-WEBHOOK] ❌ Error message:", error.message);
    console.error("[TEST-WEBHOOK] ❌ Error stack:", error.stack);
    return res.status(500).json({ error: "Internal server error" });
  }
}
