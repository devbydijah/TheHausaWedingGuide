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
 * Send PDF download email (custom HTML via Brevo)
 * @param {string} email
 * @param {string} downloadLink
 */
export async function sendDownloadEmail(email, downloadLink) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address provided.");
  }
  const html = render(
    <PDFGuideEmail name={email.split("@")[0]} downloadUrl={downloadLink} />
  );
  const text = `Your Northern Wedding PDF Guide by Hausa Room is ready!\n\nDownload link: ${downloadLink}\n\nThis link expires in 24 hours.\n\nHappy planning!`;
  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: FROM_EMAIL, name: FROM_NAME },
    subject: "Your Northern Wedding PDF Guide by Hausa Room - Download Link",
    htmlContent: html,
    textContent: text,
  };
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
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
 * Send web app access email (custom HTML via Brevo)
 * @param {string} email
 * @param {string} txReference
 */
export async function sendWebAppAccessEmail(email, txReference) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address provided.");
  }
  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;
  const html = render(
    <WebGuideEmail name={email.split("@")[0]} signupUrl={signupUrl} />
  );
  const text = `Your Northern Wedding Interactive Guide by Hausa Room\n\nThank you for purchasing The Northern Wedding Interactive Planner.\n\nHOW TO GET STARTED:\n1. Click this link: ${signupUrl}\n2. Create your account using this email: ${email}\n3. Choose a secure password (at least 8 characters)\n4. Start planning your dream wedding!\n\nACCESS DURATION: You have 20 days from your first login.\n\nWHAT'S INCLUDED:\n- Vision & Values Quiz\n- Smart Budget Builder\n- Vendor Tracker\n- Timeline & Task Manager\n- Cloud sync across devices\n- Export personalized PDF\n\nHappy planning!\n\nTransaction Reference: ${txReference}`;
  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: FROM_EMAIL, name: FROM_NAME },
    subject: "Your Northern Wedding Interactive Guide by Hausa Room",
    htmlContent: html,
    textContent: text,
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
 * Send bundle email (PDF + Web App) via custom HTML
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
  const html = render(
    <BundleEmail
      name={email.split("@")[0]}
      downloadUrl={downloadLink}
      signupUrl={signupUrl}
      hasExistingAccount={hasExistingAccount}
    />
  );
  const text = `Your Northern Wedding Complete Guide by Hausa Room\n\nYou now have access to BOTH products:\n\nPDF GUIDE:\nDownload: ${downloadLink}\n(Link expires in 24 hours)\n\nINTERACTIVE PLANNER:\n${
    hasExistingAccount
      ? `You already have an account! Log in at: ${WEB_APP_URL}`
      : `Create your account: ${signupUrl}`
  }\n\nWHAT YOU GET:\n✅ Downloadable PDF Guide\n✅ Interactive Web Planner (20-day access)\n✅ Vision & Values Quiz\n✅ Smart Budget Builder\n✅ Vendor Tracker\n✅ Timeline Manager\n✅ Cloud Sync\n\nHappy planning!\n\nTransaction Reference: ${txRef}`;
  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: FROM_EMAIL, name: FROM_NAME },
    subject: "Your Northern Wedding Complete Guide by Hausa Room",
    htmlContent: html,
    textContent: text,
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
