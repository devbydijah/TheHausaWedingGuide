// Email service using Resend
import SibApiV3Sdk from "sib-api-v3-sdk";
import fs from "fs";
import { render } from "@react-email/render";
import PDFGuideEmail from "../emails/PDFGuideEmail.jsx";
import WebGuideEmail from "../emails/WebGuideEmail.jsx";
import BundleEmail from "../emails/BundleEmail.jsx";

// Helper: Validate email address format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Use environment variables for all sensitive config, require in production
if (process.env.NODE_ENV === "production") {
  if (!process.env.BREVO_API_KEY)
    throw new Error("FATAL: BREVO_API_KEY environment variable is not set.");
}
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = "contact@devwithdijah.com";
const FROM_NAME = "Hausa Room";
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  BREVO_API_KEY;

const WEB_APP_URL =
  process.env.WEB_APP_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:5173");

/**
 * Send PDF download email (Brevo template)
 * @param {string} email
 * @param {string} downloadLink
 */
export async function sendDownloadEmail(email, downloadLink) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address provided.");
  }
  // Replace with your Brevo template ID for PDF download
  const templateId = parseInt(process.env.BREVO_PDF_TEMPLATE_ID, 10);
  const params = {
    name: email.split("@")[0],
    downloadUrl: downloadLink,
  };
  const sendSmtpEmail = {
    to: [{ email }],
    templateId,
    params,
    sender: { email: FROM_EMAIL, name: FROM_NAME },
  };
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // Log message ID
    if (data?.messageId) {
      const logLine = `[${new Date().toISOString()}] sendDownloadEmail to ${email}: ${data.messageId}\n`;
      fs.appendFileSync("brevo-email-ids.log", logLine);
    }
    return data;
  } catch (error) {
    console.error("[EMAIL] ❌ Brevo error:", error);
    throw error;
  }
}

/**
 * Send web app access email (Brevo template)
 * @param {string} email
 * @param {string} txReference
 */
export async function sendWebAppAccessEmail(email, txReference) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address provided.");
  }
  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;
  // Replace with your Brevo template ID for web app access
  const templateId = parseInt(process.env.BREVO_WEBAPP_TEMPLATE_ID, 10);
  const params = {
    name: email.split("@")[0],
    signupUrl,
    txReference,
  };
  const sendSmtpEmail = {
    to: [{ email }],
    templateId,
    params,
    sender: { email: FROM_EMAIL, name: FROM_NAME },
  };
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    if (data?.messageId) {
      const logLine = `[${new Date().toISOString()}] sendWebAppAccessEmail to ${email}: ${data.messageId}\n`;
      fs.appendFileSync("brevo-email-ids.log", logLine);
    }
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("[EMAIL] ❌ Brevo error:", error);
    throw error;
  }
}

/**
 * Send bundle email (PDF + Web App) via Brevo template
 * @param {string} email
 * @param {string} downloadLink
 * @param {string} txRef
 * @param {boolean} hasExistingAccount
 */
export async function sendBundleEmail(
  email,
  downloadLink,
  txRef,
  hasExistingAccount = false
) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address provided.");
  }
  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;
  // Replace with your Brevo template ID for bundle
  const templateId = parseInt(process.env.BREVO_BUNDLE_TEMPLATE_ID, 10);
  const params = {
    name: email.split("@")[0],
    downloadUrl,
    signupUrl,
    txRef,
    hasExistingAccount,
  };
  const sendSmtpEmail = {
    to: [{ email }],
    templateId,
    params,
    sender: { email: FROM_EMAIL, name: FROM_NAME },
  };
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    if (data?.messageId) {
      const logLine = `[${new Date().toISOString()}] sendBundleEmail to ${email}: ${data.messageId}\n`;
      fs.appendFileSync("brevo-email-ids.log", logLine);
    }
    return data;
  } catch (error) {
    console.error("[EMAIL] ❌ Brevo error:", error);
    throw error;
  }
}
