// Simple Paystack webhook that sends download links via email using Resend
import crypto from "crypto";
import {
  sendDownloadEmail,
  sendWebAppAccessEmail,
  sendBundleEmail,
} from "../lib/email.js";
import { tokenDB } from "../lib/database.cjs";
import { createClient } from "@supabase/supabase-js";

// Environment variables (support both test and live secrets)
const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY || null;
const PAYSTACK_LIVE_SECRET = process.env.PAYSTACK_SECRET_KEY || null;

// Supabase Admin Client (for creating users)
const supabaseAdmin =
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL
    ? createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    : null;

// Product-specific URLs
const PDF_BASE_URL = "https://the-hausa-weding-guide.vercel.app";
const WEBAPP_BASE_URL = "https://the-hausa-weding-guide-interactive.vercel.app";

const WEBHOOK_TEST_BYPASS =
  (process.env.PAYSTACK_WEBHOOK_TEST_BYPASS || "").toLowerCase() === "true";

// Verify Paystack signature using the raw request body string
// Tries both TEST and LIVE secrets when available to support a single URL for both modes
function verifySignature(rawBodyString, signature) {
  if (!signature) return { ok: false, mode: null };
  const candidates = [
    { key: PAYSTACK_TEST_SECRET, mode: "test" },
    { key: PAYSTACK_LIVE_SECRET, mode: "live" },
  ].filter((c) => !!c.key);

  for (const c of candidates) {
    const hmac = crypto.createHmac("sha512", c.key);
    hmac.update(rawBodyString);
    const digest = hmac.digest("hex");
    if (digest === signature) return { ok: true, mode: c.mode };
  }
  return { ok: false, mode: null };
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

    const verification = verifySignature(rawBodyString, signature);
    if (!verification.ok) {
      if (WEBHOOK_TEST_BYPASS) {
        console.warn(
          "Paystack signature invalid, but PAYSTACK_WEBHOOK_TEST_BYPASS=true — continuing in TEST mode"
        );
      } else {
        console.log("Invalid signature");
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    const { event, data } = req.body || {};
    console.log(
      "Webhook event received:",
      event,
      "status:",
      data?.status,
      "reference:",
      data?.reference
    );

    // Only process successful payments
    if (event === "charge.success" && data?.status === "success") {
      const reference = data?.reference;
      const email = data?.customer?.email || "unknown";

      console.log(
        `Processing successful payment for: ${email.replace(/(.{2}).*(@.*)/, "$1***$2")} (mode: ${
          verification.mode || (WEBHOOK_TEST_BYPASS ? "test-bypass" : "unknown")
        })`
      );

      // Verify transaction via Paystack API as an extra safety net (handles signature/bypass edge cases)
      try {
        const keyForVerify =
          verification.mode === "live"
            ? PAYSTACK_LIVE_SECRET || PAYSTACK_TEST_SECRET
            : verification.mode === "test"
              ? PAYSTACK_TEST_SECRET || PAYSTACK_LIVE_SECRET
              : PAYSTACK_LIVE_SECRET || PAYSTACK_TEST_SECRET; // fallback

        if (!keyForVerify) {
          console.error("No Paystack secret available for verification");
          return res.status(500).json({ error: "Server not configured" });
        }

        const resp = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(
            reference || ""
          )}`,
          {
            headers: {
              Authorization: `Bearer ${keyForVerify}`,
              Accept: "application/json",
            },
          }
        );
        const verifyJson = await resp.json();
        if (!resp.ok || verifyJson?.data?.status !== "success") {
          console.error("Paystack verify failed", verifyJson);
          return res.status(400).json({ error: "Verification failed" });
        }

        // Prefer the email returned by Paystack verify API to avoid spoofing
        const verifiedEmail =
          verifyJson?.data?.customer?.email || data?.customer?.email;
        if (!verifiedEmail) {
          console.error("No customer email available after verification");
          return res.status(400).json({ error: "No customer email available" });
        }

        // ============================================
        // PRODUCT DETECTION - AMOUNT-BASED
        // ============================================
        // Detect product type primarily by amount (in kobo)
        const amount = verifyJson?.data?.amount || data?.amount || 0;
        const txReference =
          verifyJson?.data?.reference || data?.reference || "";

        // Amount-based detection (primary method)
        const isPdfGuide = amount === 11000; // ₦110 = 11,000 kobo (main branch)
        const isWebGuide = amount === 10000; // ₦100 = 10,000 kobo (interactive-guide branch)

        let productType;
        if (isPdfGuide) {
          productType = "pdf";
        } else if (isWebGuide) {
          productType = "webapp";
        } else {
          // Fallback: try to detect from metadata or reference
          const metadata = verifyJson?.data?.metadata || data?.metadata || {};
          const metadataType = (metadata.product_type || "").toLowerCase();

          if (metadataType === "webapp" || metadataType === "interactive") {
            productType = "webapp";
          } else if (
            txReference.toLowerCase().includes("webapp") ||
            txReference.toLowerCase().includes("interactive")
          ) {
            productType = "webapp";
          } else {
            console.warn(
              `Unknown product amount: ₦${(amount / 100).toFixed(2)} (${amount} kobo). Defaulting to PDF.`
            );
            productType = "pdf"; // Default to PDF for backward compatibility
          }
        }

        console.log(
          `Product detected: ${productType} | Amount: ₦${(amount / 100).toFixed(2)} (${amount} kobo) | Reference: ${txReference}`
        );

        // ============================================
        // CHECK FOR EXISTING PURCHASES (BUNDLE DETECTION)
        // ============================================
        // Check if user has already purchased the other product
        let hasPdfPurchase = false;
        let hasWebappPurchase = false;
        let shouldSendBundleEmail = false;

        if (supabaseAdmin) {
          try {
            // Check for PDF purchase (stored in sales table or downloads.db)
            const pdfToken = tokenDB.getTokensByEmail(verifiedEmail);
            hasPdfPurchase = pdfToken && pdfToken.length > 0;

            // Check for webapp purchase (stored in web_app_users table)
            const { data: webappUser } = await supabaseAdmin
              .from("web_app_users")
              .select("email")
              .eq("email", verifiedEmail)
              .single();
            hasWebappPurchase = !!webappUser;

            // Determine if we should send bundle email
            if (productType === "pdf" && hasWebappPurchase) {
              shouldSendBundleEmail = true;
              console.log(
                `User ${verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2")} already has webapp - sending bundle email`
              );
            } else if (productType === "webapp" && hasPdfPurchase) {
              shouldSendBundleEmail = true;
              console.log(
                `User ${verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2")} already has PDF - sending bundle email`
              );
            }
          } catch (err) {
            console.error("Error checking existing purchases:", err);
          }
        }

        // ============================================
        // SAVE TO DATABASE
        // ============================================
        // Save to appropriate database table based on product type
        let hasExistingAccount = false;

        if (productType === "webapp") {
          if (supabaseAdmin) {
            try {
              // Check if user already exists in web_app_users
              const { data: existingUser } = await supabaseAdmin
                .from("web_app_users")
                .select("email, paystack_reference")
                .eq("email", verifiedEmail)
                .single();

              if (existingUser) {
                console.log(
                  `User ${verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2")} already exists in database with reference: ${existingUser.paystack_reference}`
                );
                hasExistingAccount = true;
              } else {
                // Create new web_app_users record (NO auth account yet)
                const { error: dbError } = await supabaseAdmin
                  .from("web_app_users")
                  .insert({
                    email: verifiedEmail,
                    paystack_reference: txReference,
                    purchased_at: new Date().toISOString(),
                    access_days: 20,
                    is_onboarded: false,
                  });

                if (dbError) {
                  console.error(
                    "Failed to create web_app_users record:",
                    dbError
                  );
                } else {
                  console.log(
                    `Database record created for ${verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2")} - user will create account during signup`
                  );
                }
              }
            } catch (err) {
              console.error("Database operation error:", err);
            }
          } else {
            console.warn(
              "Supabase admin client not configured - skipping database save. Check SUPABASE_SERVICE_ROLE_KEY and VITE_SUPABASE_URL."
            );
          }
        }

        // ============================================
        // SEND APPROPRIATE EMAIL BASED ON PRODUCT TYPE
        // ============================================

        // If user has purchased both products, send bundle email
        if (shouldSendBundleEmail) {
          // Generate download token for PDF (if this is a PDF purchase, token is new; if webapp purchase, retrieve existing)
          let downloadLink;

          if (productType === "pdf") {
            // Just purchased PDF, create new token
            const token = crypto.randomBytes(32).toString("hex");
            const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

            const SECRET =
              process.env.DOWNLOAD_TOKEN_SECRET ||
              process.env.PAYSTACK_SECRET_KEY;
            const hmac = crypto.createHmac("sha256", SECRET);
            hmac.update(`${token}|${verifiedEmail}|${expires}`);
            const sig = hmac.digest("hex");

            const stored = tokenDB.storeToken(verifiedEmail, token, expires, 3);
            if (!stored) {
              console.error("Failed to store token in database");
              return res
                .status(500)
                .json({ error: "Failed to create download token" });
            }

            downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
              verifiedEmail
            )}&sig=${sig}`;
          } else {
            // Just purchased webapp, retrieve existing PDF token
            const existingTokens = tokenDB.getTokensByEmail(verifiedEmail);
            if (existingTokens && existingTokens.length > 0) {
              const existingToken = existingTokens[0];
              const SECRET =
                process.env.DOWNLOAD_TOKEN_SECRET ||
                process.env.PAYSTACK_SECRET_KEY;
              const hmac = crypto.createHmac("sha256", SECRET);
              hmac.update(
                `${existingToken.token}|${verifiedEmail}|${existingToken.expires_at}`
              );
              const sig = hmac.digest("hex");

              downloadLink = `${PDF_BASE_URL}?download=${existingToken.token}&expires=${existingToken.expires_at}&email=${encodeURIComponent(
                verifiedEmail
              )}&sig=${sig}`;
            } else {
              console.error("No existing PDF token found for bundle email");
              // Fallback: send webapp-only email
              await sendWebAppAccessEmail(verifiedEmail, txReference);
              console.log(
                "Fallback: Web app email sent (no PDF token found) to:",
                verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2")
              );
              return res.status(200).json({ received: true });
            }
          }

          // Send bundle email with both PDF + web app access
          await sendBundleEmail(
            verifiedEmail,
            downloadLink,
            txReference,
            hasExistingAccount
          );
          console.log(
            "Bundle email sent (user has both products) to:",
            verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2")
          );
        } else if (productType === "webapp") {
          // Web App Only - send signup instructions (NO temporary password)
          if (!hasExistingAccount) {
            await sendWebAppAccessEmail(verifiedEmail, txReference);
            console.log(
              "Web app signup email sent successfully to:",
              verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2")
            );
          } else {
            console.log(
              "Skipping email - user already has account:",
              verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2")
            );
          }
        } else {
          // PDF Only - send download link
          const token = crypto.randomBytes(32).toString("hex");
          const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

          const SECRET =
            process.env.DOWNLOAD_TOKEN_SECRET ||
            process.env.PAYSTACK_SECRET_KEY;
          const hmac = crypto.createHmac("sha256", SECRET);
          hmac.update(`${token}|${verifiedEmail}|${expires}`);
          const sig = hmac.digest("hex");

          const stored = tokenDB.storeToken(verifiedEmail, token, expires, 3);
          if (!stored) {
            console.error("Failed to store token in database");
            return res
              .status(500)
              .json({ error: "Failed to create download token" });
          }

          const downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
            verifiedEmail
          )}&sig=${sig}`;

          await sendDownloadEmail(verifiedEmail, downloadLink);
          console.log(
            "PDF download email sent successfully to:",
            verifiedEmail.replace(/(.{2}).*(@.*)/, "$1***$2")
          );
        }
      } catch (e) {
        console.error("Error verifying/sending email:", e);
        return res.status(500).json({ error: "Verification/email failed" });
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
