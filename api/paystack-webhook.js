// Simple Paystack webhook that sends download links via email using Resend
import crypto from "crypto";
import {
  sendDownloadEmail,
  sendWebAppAccessEmail,
  sendBundleEmail,
} from "../lib/email.js";
import { tokenDB } from "../lib/database.cjs";

// Environment variables (support both test and live secrets)
const PAYSTACK_TEST_SECRET = process.env.PAYSTACK_TEST_SECRET_KEY || null;
const PAYSTACK_LIVE_SECRET = process.env.PAYSTACK_SECRET_KEY || null;

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
        // PRODUCT DETECTION
        // ============================================
        // Check metadata for product_type, fallback to checking reference/amount
        const metadata = verifyJson?.data?.metadata || data?.metadata || {};
        const productName = (
          verifyJson?.data?.plan?.name ||
          verifyJson?.data?.product_name ||
          data?.plan?.name ||
          data?.product_name ||
          ""
        ).toLowerCase();
        const reference = (
          verifyJson?.data?.reference ||
          data?.reference ||
          ""
        ).toLowerCase();
        const amount = verifyJson?.data?.amount || data?.amount || 0;

        let productType = (metadata.product_type || "").toLowerCase();

        // Fallback: detect from reference first, then amount, then product name
        if (!productType) {
          if (
            reference.includes("webapp") ||
            reference.includes("interactive")
          ) {
            productType = "webapp";
          } else if (reference.includes("pdf")) {
            productType = "pdf";
          } else if (
            reference.includes("bundle") ||
            reference.includes("complete")
          ) {
            productType = "bundle";
          } else if (
            productName.includes("interactive") ||
            productName.includes("webapp") ||
            productName.includes("web app")
          ) {
            productType = "webapp";
          } else if (
            productName.includes("bundle") ||
            productName.includes("complete")
          ) {
            productType = "bundle";
          } else {
            productType = "pdf"; // Default to PDF for backward compatibility
          }
        }

        console.log(
          `Product type detected: ${productType} (reference: '${reference}', amount: ₦${(amount / 100).toFixed(2)}, product name: '${productName}')`
        );

        // ============================================
        // HANDLE DIFFERENT PRODUCT TYPES
        // ============================================

        if (productType === "webapp") {
          // Web App Only - redirect to claim page for interactive guide
          const claimUrl = `${WEBAPP_BASE_URL}/?claim=1`;

          await sendWebAppAccessEmail(verifiedEmail, claimUrl);
          console.log(
            "Web app access email sent successfully to:",
            verifiedEmail
          );
        } else if (productType === "bundle") {
          // Bundle - send both PDF download + web app access
          // Generate download token for PDF
          const token = crypto.randomBytes(32).toString("hex");
          const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

          // Create HMAC signature for token verification
          const SECRET =
            process.env.DOWNLOAD_TOKEN_SECRET ||
            process.env.PAYSTACK_SECRET_KEY;
          const hmac = crypto.createHmac("sha256", SECRET);
          hmac.update(`${token}|${verifiedEmail}|${expires}`);
          const sig = hmac.digest("hex");

          // Store token in database
          const stored = tokenDB.storeToken(verifiedEmail, token, expires, 3);
          if (!stored) {
            console.error("Failed to store token in database");
            return res
              .status(500)
              .json({ error: "Failed to create download token" });
          }

          // Create download URL for PDF
          const downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
            verifiedEmail
          )}&sig=${sig}`;

          // Create claim URL for webapp
          const claimUrl = `${WEBAPP_BASE_URL}/?claim=1`;

          // Send bundle email with both PDF + web app access
          await sendBundleEmail(verifiedEmail, downloadLink, claimUrl);
          console.log("Bundle email sent successfully to:", verifiedEmail);
        } else {
          // PDF Only (default) - send download link
          const token = crypto.randomBytes(32).toString("hex");
          const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

          // Create HMAC signature for token verification
          const SECRET =
            process.env.DOWNLOAD_TOKEN_SECRET ||
            process.env.PAYSTACK_SECRET_KEY;
          const hmac = crypto.createHmac("sha256", SECRET);
          hmac.update(`${token}|${verifiedEmail}|${expires}`);
          const sig = hmac.digest("hex");

          // Store token in database
          const stored = tokenDB.storeToken(verifiedEmail, token, expires, 3);
          if (!stored) {
            console.error("Failed to store token in database");
            return res
              .status(500)
              .json({ error: "Failed to create download token" });
          }

          // Create download URL
          const downloadLink = `${PDF_BASE_URL}?download=${token}&expires=${expires}&email=${encodeURIComponent(
            verifiedEmail
          )}&sig=${sig}`;

          // Send PDF download email
          await sendDownloadEmail(verifiedEmail, downloadLink);
          console.log(
            "PDF download email sent successfully to:",
            verifiedEmail
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
