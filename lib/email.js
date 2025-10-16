// Email service using Resend
import { Resend } from "resend";
import fs from "fs";
import { render } from "@react-email/render";
import PDFGuideEmail from "../emails/PDFGuideEmail.jsx";
import WebGuideEmail from "../emails/WebGuideEmail.jsx";
import BundleEmail from "../emails/BundleEmail.jsx";

// Helper: Validate email address format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Use environment variable for API key, fallback to provided key for local/dev
const RESEND_API_KEY =
  process.env.RESEND_API_KEY || "re_dGsrnuX4_C68HnhpBEcFez4Co3Z5fej3u";
const resend = new Resend(RESEND_API_KEY);
const FROM_EMAIL = "onboarding@resend.dev";
const FROM_ADDRESS = `Hausa Room <${FROM_EMAIL}>`;
const REPLY_TO = "contact@devwithdijah.com";

const WEB_APP_URL =
  process.env.WEB_APP_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:5173");

/**
 * Send PDF download email
 */
export async function sendDownloadEmail(email, downloadLink) {
  console.log("\n========================================");
  console.log("[EMAIL] 📧 sendDownloadEmail() called");
  console.log("[EMAIL] 📧 To:", email);
  console.log("[EMAIL] 📧 Download link provided:", !!downloadLink);
  console.log("[EMAIL] 📧 FROM_ADDRESS:", FROM_ADDRESS);

  if (!isValidEmail(email)) {
    throw new Error("Invalid email address provided.");
  }

  try {
    console.log("[EMAIL] 📤 Calling resend.emails.send()...");

    const html = render(
      <PDFGuideEmail name={email.split("@")[0]} downloadUrl={downloadLink} />
    );
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Your Northern Wedding PDF Guide by Hausa Room - Download Link",
      html,
      text: `Your Northern Wedding PDF Guide by Hausa Room is ready!\n\nDownload link: ${downloadLink}\n\nThis link expires in 24 hours.\n\nHappy planning!`,
      reply_to: REPLY_TO,
    });

    if (error) {
      console.error("[EMAIL] ❌ Resend returned error:", error);
      console.error(
        "[EMAIL] ❌ Error details:",
        JSON.stringify(error, null, 2)
      );
      throw new Error(error.message);
    }

    console.log("[EMAIL] ✅✅ PDF download email sent successfully!");
    console.log("[EMAIL] ✅ Message ID:", data?.id);
    console.log("[EMAIL] ✅ To:", email.replace(/(.{2}).*(@.*)/, "$1***$2"));
    // Save the email ID to a log file for tracking
    if (data?.id) {
      const logLine = `[${new Date().toISOString()}] sendDownloadEmail to ${email}: ${data.id}\n`;
      fs.appendFileSync("resend-email-ids.log", logLine);
    }
    console.log("========================================\n");
    return data;
  } catch (error) {
    console.error("\n[EMAIL] ❌❌ EXCEPTION in sendDownloadEmail()");
    console.error("[EMAIL] ❌ Error:", error);
    console.error("[EMAIL] ❌ Error message:", error.message);
    console.error("[EMAIL] ❌ Error stack:", error.stack);
    console.error("========================================\n");
    throw error;
  }
}

/**
 * Send web app access email
 */
export async function sendWebAppAccessEmail(email, txReference) {
  console.log("\n========================================");
  console.log("[EMAIL] 📧 sendWebAppAccessEmail() called");
  console.log("[EMAIL] 📧 To:", email);
  console.log("[EMAIL] � Reference:", txReference);
  console.log("[EMAIL] � FROM_ADDRESS:", FROM_ADDRESS);

  if (!isValidEmail(email)) {
    throw new Error("Invalid email address provided.");
  }

  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;
  console.log("[EMAIL] 🔗 Signup URL:", signupUrl);

  try {
    console.log("[EMAIL] 📤 Calling resend.emails.send()...");

    // Render the React email template to HTML
    const html = render(
      <WebGuideEmail name={email.split("@")[0]} signupUrl={signupUrl} />
    );
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Your Northern Wedding Interactive Guide by Hausa Room",
      html,
      text: `Your Northern Wedding Interactive Guide by Hausa Room\n\nThank you for purchasing The Northern Wedding Interactive Planner.\n\nHOW TO GET STARTED:\n1. Click this link: ${signupUrl}\n2. Create your account using this email: ${email}\n3. Choose a secure password (at least 8 characters)\n4. Start planning your dream wedding!\n\nACCESS DURATION: You have 20 days from your first login.\n\nWHAT'S INCLUDED:\n- Vision & Values Quiz\n- Smart Budget Builder\n- Vendor Tracker\n- Timeline & Task Manager\n- Cloud sync across devices\n- Export personalized PDF\n\nHappy planning!\n\nTransaction Reference: ${txReference}`,
      reply_to: REPLY_TO,
    });

    if (error) {
      console.error("[EMAIL] ❌ Resend returned error:", error);
      console.error(
        "[EMAIL] ❌ Error details:",
        JSON.stringify(error, null, 2)
      );
      throw new Error(error.message);
    }

    console.log("[EMAIL] ✅✅ Web app email sent successfully!");
    console.log("[EMAIL] ✅ Message ID:", data?.id);
    console.log("[EMAIL] ✅ To:", email.replace(/(.{2}).*(@.*)/, "$1***$2"));
    // Save the email ID to a log file for tracking
    if (data?.id) {
      const logLine = `[${new Date().toISOString()}] sendWebAppAccessEmail to ${email}: ${data.id}\n`;
      fs.appendFileSync("resend-email-ids.log", logLine);
    }
    console.log("========================================\n");
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("\n[EMAIL] ❌❌ EXCEPTION in sendWebAppAccessEmail()");
    console.error("[EMAIL] ❌ Error:", error);
    console.error("[EMAIL] ❌ Error message:", error.message);
    console.error("[EMAIL] ❌ Error stack:", error.stack);
    console.error("========================================\n");
    throw error;
  }
}

/**
 * Send bundle email (both PDF + Web App)
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
  try {
    const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;

    const html = render(
      <BundleEmail
        name={email.split("@")[0]}
        downloadUrl={downloadLink}
        signupUrl={signupUrl}
        hasExistingAccount={hasExistingAccount}
      />
    );
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Your Northern Wedding Complete Guide by Hausa Room",
      html,
      text: `Your Northern Wedding Complete Guide by Hausa Room\n\nYou now have access to BOTH products:\n\nPDF GUIDE:\nDownload: ${downloadLink}\n(Link expires in 24 hours)\n\nINTERACTIVE PLANNER:\n${
        hasExistingAccount
          ? `You already have an account! Log in at: ${WEB_APP_URL}`
          : `Create your account: ${signupUrl}`
      }\n\nWHAT YOU GET:\n✅ Downloadable PDF Guide\n✅ Interactive Web Planner (20-day access)\n✅ Vision & Values Quiz\n✅ Smart Budget Builder\n✅ Vendor Tracker\n✅ Timeline Manager\n✅ Cloud Sync\n\nHappy planning!\n\nTransaction Reference: ${txRef}`,
      reply_to: REPLY_TO,
    });

    if (error) {
      console.error("[EMAIL] Resend error:", error);
      throw new Error(error.message);
    }

    console.log(
      "[EMAIL] Bundle email sent to:",
      email.replace(/(.{2}).*(@.*)/, "$1***$2")
    );
    // Save the email ID to a log file for tracking
    if (data?.id) {
      const logLine = `[${new Date().toISOString()}] sendBundleEmail to ${email}: ${data.id}\n`;
      fs.appendFileSync("resend-email-ids.log", logLine);
    }
    return data;
  } catch (error) {
    console.error("[EMAIL] Failed to send bundle email:", error);
    throw error;
  }
}
