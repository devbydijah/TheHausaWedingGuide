// Email service using Resend
import { Resend } from "resend";

console.log("[EMAIL-INIT] 🚀 Initializing email service...");
console.log(
  "[EMAIL-INIT] 🔑 RESEND_API_KEY exists:",
  !!process.env.RESEND_API_KEY
);
console.log(
  "[EMAIL-INIT] 🔑 API Key (first 10 chars):",
  process.env.RESEND_API_KEY?.substring(0, 10)
);

const resend = new Resend("re_Fo7wZakF_H5RD6Rk9zXqRBVtrHd7JC358");
// Configuration
const FROM_EMAIL = process.env.FROM_EMAIL || "contact@devwithdijah.com";
const FROM_ADDRESS = `Hausa Room <${FROM_EMAIL}>`;

console.log("[EMAIL-INIT] 📮 FROM_EMAIL:", FROM_EMAIL);
console.log("[EMAIL-INIT] 📮 FROM_ADDRESS:", FROM_ADDRESS);

const WEB_APP_URL =
  process.env.WEB_APP_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:5173");

console.log("[EMAIL-INIT] 🌐 WEB_APP_URL:", WEB_APP_URL);
console.log("[EMAIL-INIT] ✅ Email service initialized\n");

/**
 * Send PDF download email
 */
export async function sendDownloadEmail(email, downloadLink) {
  console.log("\n========================================");
  console.log("[EMAIL] 📧 sendDownloadEmail() called");
  console.log("[EMAIL] 📧 To:", email);
  console.log("[EMAIL] 📧 Download link provided:", !!downloadLink);
  console.log("[EMAIL] 📧 FROM_ADDRESS:", FROM_ADDRESS);

  try {
    console.log("[EMAIL] 📤 Calling resend.emails.send()...");

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Your Hausa Wedding Guide - Download Link",
      html: `
        <h1>Your Guide is Ready!</h1>
        <p>Thank you for purchasing The Hausa Wedding Guide PDF.</p>
        <p><a href="${downloadLink}" style="display:inline-block;background:#CE805C;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;">Download Your Guide</a></p>
        <p>This link expires in 24 hours.</p>
        <p>Happy planning!</p>
      `,
      text: `Your Hausa Wedding Guide is ready!\n\nDownload link: ${downloadLink}\n\nThis link expires in 24 hours.\n\nHappy planning!`,
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

  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;
  console.log("[EMAIL] 🔗 Signup URL:", signupUrl);

  try {
    console.log("[EMAIL] 📤 Calling resend.emails.send()...");

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Welcome to Your Interactive Wedding Guide! 🎉",
      html: `
        <h1>Welcome to Your Interactive Wedding Guide!</h1>
        <p>Thank you for purchasing The Hausa Wedding Guide Interactive Planner.</p>
        
        <h2>How to Get Started:</h2>
        <ol>
          <li>Click the button below to access your planner</li>
          <li>Create your account using this email: <strong>${email}</strong></li>
          <li>Choose a secure password (at least 8 characters)</li>
          <li>Start planning your dream wedding!</li>
        </ol>

        <p style="margin: 30px 0;">
          <a href="${signupUrl}" style="display:inline-block;background:#CE805C;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-size:16px;">Create Your Account & Start Planning</a>
        </p>

        <p><strong>Access Duration:</strong> You have 20 days from your first login to use the interactive planner.</p>

        <p><strong>What's Included:</strong></p>
        <ul>
          <li>Vision & Values Quiz</li>
          <li>Smart Budget Builder</li>
          <li>Vendor Tracker</li>
          <li>Timeline & Task Manager</li>
          <li>Cloud sync across devices</li>
          <li>Export personalized PDF</li>
        </ul>

        <p>Happy planning!</p>
        <p style="font-size: 12px; color: #666;">Transaction Reference: ${txReference}</p>
      `,
      text: `Welcome to Your Interactive Wedding Guide!

Thank you for purchasing The Hausa Wedding Guide Interactive Planner.

HOW TO GET STARTED:
1. Click this link: ${signupUrl}
2. Create your account using this email: ${email}
3. Choose a secure password (at least 8 characters)
4. Start planning your dream wedding!

ACCESS DURATION: You have 20 days from your first login.

WHAT'S INCLUDED:
- Vision & Values Quiz
- Smart Budget Builder
- Vendor Tracker
- Timeline & Task Manager
- Cloud sync across devices
- Export personalized PDF

Happy planning!

Transaction Reference: ${txReference}`,
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
  try {
    const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject:
        "You Now Have Both Products - Complete Wedding Planning Package!",
      html: `
        <h1>🎉 Complete Wedding Planning Package!</h1>
        <p>Great news! You now have access to <strong>both</strong> The Hausa Wedding Guide PDF and the Interactive Planner.</p>

        <h2>📄 Your PDF Guide:</h2>
        <p><a href="${downloadLink}" style="display:inline-block;background:#CE805C;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;margin:10px 0;">Download PDF Guide</a></p>
        <p style="font-size: 14px; color: #666;">Link expires in 24 hours</p>

        <h2>💻 Your Interactive Planner:</h2>
        ${
          hasExistingAccount
            ? `
          <p>You already have an account! Simply log in to access your planner.</p>
          <p><a href="${WEB_APP_URL}" style="display:inline-block;background:#740015;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;margin:10px 0;">Go to Interactive Planner</a></p>
        `
            : `
          <p>Create your account to get started:</p>
          <p><a href="${signupUrl}" style="display:inline-block;background:#740015;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;margin:10px 0;">Create Account & Start Planning</a></p>
        `
        }

        <p><strong>What You Get:</strong></p>
        <ul>
          <li>✅ Downloadable PDF Guide (24-hour access)</li>
          <li>✅ Interactive Web Planner (20-day access)</li>
          <li>✅ Vision & Values Quiz</li>
          <li>✅ Smart Budget Builder</li>
          <li>✅ Vendor Tracker</li>
          <li>✅ Timeline Manager</li>
          <li>✅ Cloud Sync</li>
        </ul>

        <p>Happy planning!</p>
        <p style="font-size: 12px; color: #666;">Transaction Reference: ${txRef}</p>
      `,
      text: `🎉 Complete Wedding Planning Package!

You now have access to BOTH products:

PDF GUIDE:
Download: ${downloadLink}
(Link expires in 24 hours)

INTERACTIVE PLANNER:
${
  hasExistingAccount
    ? `You already have an account! Log in at: ${WEB_APP_URL}`
    : `Create your account: ${signupUrl}`
}

WHAT YOU GET:
✅ Downloadable PDF Guide
✅ Interactive Web Planner (20-day access)
✅ Vision & Values Quiz
✅ Smart Budget Builder
✅ Vendor Tracker
✅ Timeline Manager
✅ Cloud Sync

Happy planning!

Transaction Reference: ${txRef}`,
    });

    if (error) {
      console.error("[EMAIL] Resend error:", error);
      throw new Error(error.message);
    }

    console.log(
      "[EMAIL] Bundle email sent to:",
      email.replace(/(.{2}).*(@.*)/, "$1***$2")
    );
    return data;
  } catch (error) {
    console.error("[EMAIL] Failed to send bundle email:", error);
    throw error;
  }
}
