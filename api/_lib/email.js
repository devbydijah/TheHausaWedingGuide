import * as Brevo from "@getbrevo/brevo";
import { render } from "@react-email/render";
import PDFGuideEmail from "../../emails/PDFGuideEmail.jsx";
import WebGuideEmail from "../../emails/WebGuideEmail.jsx";
import BundleEmail from "../../emails/BundleEmail.jsx";

// --- 1. CONFIGURE THE API INSTANCE ---
// This is the new, correct way to set up the client.
const apiInstance = new Brevo.TransactionalEmailsApi();

// Get the API key from environment variables
const BREVO_API_KEY = process.env.BREVO_API_KEY;
if (BREVO_API_KEY) {
  apiInstance.authentications["api-key"].apiKey = BREVO_API_KEY;
} else {
  console.error("FATAL: BREVO_API_KEY environment variable is not set.");
  // In production, you should throw an error here to stop the function
  // throw new Error("FATAL: BREVO_API_KEY is not set.");
}

// --- 2. SETUP SENDER AND URLS ---
const FROM_EMAIL = process.env.FROM_EMAIL || "contact@devwithdijah.com";
const FROM_NAME = "Hausa Room";
const WEB_APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:5173";

/**
 * Send PDF download email
 * @param {string} email
 * @param {string} downloadLink
 */
export async function sendDownloadEmail(email, downloadLink) {
  const htmlContent = render(
    <PDFGuideEmail name={email.split("@")[0]} downloadUrl={downloadLink} />
  );

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject =
    "Your Northern Wedding PDF Guide by Hausa Room - Download Link";
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    console.log(
      `[EMAIL] Attempting to send 'DownloadEmail' to ${email} via Brevo...`
    );
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      `[EMAIL] ✅ Brevo API called successfully for DownloadEmail. Message ID: ${data.body.messageId}`
    );
    return data;
  } catch (error) {
    console.error(
      "[EMAIL] ❌ Brevo error in sendDownloadEmail:",
      error.message
    );
    // Log the full error for more details in Vercel logs
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}

/**
 * Send web app access email
 * @param {string} email
 * @param {string} txReference
 */
export async function sendWebAppAccessEmail(email, txReference) {
  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;
  const htmlContent = render(
    <WebGuideEmail name={email.split("@")[0]} signupUrl={signupUrl} />
  );

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject =
    "Your Northern Wedding Interactive Guide by Hausa Room";
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    console.log(
      `[EMAIL] Attempting to send 'WebAppAccessEmail' to ${email} via Brevo...`
    );
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      `[EMAIL] ✅ Brevo API called successfully for WebAppAccessEmail. Message ID: ${data.body.messageId}`
    );
    return { success: true, messageId: data.body.messageId };
  } catch (error) {
    console.error(
      "[EMAIL] ❌ Brevo error in sendWebAppAccessEmail:",
      error.message
    );
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}

/**
 * Send bundle email (PDF + Web App)
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
  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;
  const htmlContent = render(
    <BundleEmail
      name={email.split("@")[0]}
      downloadUrl={downloadLink}
      signupUrl={signupUrl}
      hasExistingAccount={hasExistingAccount}
    />
  );

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject = "Your Northern Wedding Complete Guide by Hausa Room";
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    console.log(
      `[EMAIL] Attempting to send 'BundleEmail' to ${email} via Brevo...`
    );
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      `[EMAIL] ✅ Brevo API called successfully for BundleEmail. Message ID: ${data.body.messageId}`
    );
    return data;
  } catch (error) {
    console.error("[EMAIL] ❌ Brevo error in sendBundleEmail:", error.message);
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}
