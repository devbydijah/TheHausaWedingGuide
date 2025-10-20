// File: api/email.js
import { Resend } from "resend";
// We don't need fs or path anymore since HTML is inline
// import fs from "fs";
// import path from "path";

// --- Initialize the Resend Client ---
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Sender Information ---
const fromEmail = "Hausa Room <support@hausaroom.com>"; // Client's verified domain and desired sender name

/**
 * Reusable function to send an email using Resend.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 */
async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY) {
    const errorMessage =
      "FATAL: RESEND_API_KEY is not set in environment variables.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    console.log(
      `[EMAIL] Attempting to send email to ${to} with subject "${subject}"`
    );
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error(`[EMAIL] ❌ Failed to send email to ${to}:`, error);
      // Log more detailed error if available from Resend response
      if (error.response && error.response.body) {
        console.error(
          "Resend API Error Body:",
          JSON.stringify(error.response.body, null, 2)
        );
      }
      throw error;
    }

    console.log(`[EMAIL] ✅ Successfully sent email. Message ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error("[EMAIL] Fatal error during sendEmail:", error);
    throw error;
  }
}

// --- Specific Email Functions ---

export function sendDownloadEmail(email, downloadLink) {
  const userName = email.split("@")[0] || "Friend";

  // --- HTML Template replicating PDFGuideEmail.jsx ---
  // Using inline styles based on the React Email component's styles
  const emailHtml = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap');
        body { margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Inter', sans-serif; }
        .container { max-width: 600px; background-color: #ffffff; border-radius: 8px; margin: 40px auto; padding: 24px; border: 1px solid #eee; }
        .heading { font-family: 'Playfair Display', serif; color: #740015; font-size: 24px; font-weight: 700; line-height: 32px; margin-bottom: 16px; margin-top: 0; }
        .paragraph { color: #333; font-size: 16px; line-height: 24px; margin: 16px 0; }
        .button { background-color: #CE805C; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; }
        .link-text { font-size: 14px; color: #555; margin-bottom: 8px; margin-top: 24px;}
        .link-url { font-size: 12px; color: #777; word-break: break-all; text-decoration: none; }
        .hr { margin: 24px 0; border: none; border-top: 1px solid #eee; }
        .small-text { font-size: 14px; color: #555; line-height: 24px; margin: 16px 0; }
        .footer { font-size: 12px; color: #888; margin-top: 32px; text-align: center; }
        .footer-link { color: #CE805C; text-decoration: underline; }
        .logo-section { text-align: center; margin-bottom: 32px; }
        .logo { height: 60px; margin: 0 auto; border-radius: 8px; }
        .button-section { text-align: center; margin: 24px 0; }
        @media (max-width: 600px) { .container { width: 90% !important; margin: 20px auto !important; padding: 20px !important;} .button { padding: 12px 20px !important; font-size: 14px !important;} .heading { font-size: 20px !important; } .paragraph, .small-text, .link-text { font-size: 14px !important;} }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="https://the-hausa-weding-guide.vercel.app/assets/logowhite.jpg" alt="Hausa Room Logo" class="logo" />
        </div>
        <h2 class="heading">Hi ${userName},</h2>
        <p class="paragraph">
          Thank you for your purchase! Your Hausa Wedding Guide is ready for download.
        </p>
        <p class="paragraph">
          Please click the button below to get your PDF. This link will expire in <strong>24 hours</strong>.
        </p>
        <div class="button-section">
          <a href="${downloadLink}" class="button">
            Download Your Guide
          </a>
        </div>
        <p class="link-text">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <a href="${downloadLink}" class="link-url">${downloadLink}</a>
        <hr class="hr" />
        <p class="small-text">
          If you have any issues, please contact our support team by replying to this email or sending a message to support@hausaroom.com.
        </p>
        <p class="small-text">
          Sincerely,<br/>The Hausa Room Team
        </p>
        <hr class="hr" />
        <p class="footer">
          If you have questions, visit our <a href="https://the-hausa-weding-guide.vercel.app" class="footer-link">website</a>.
        </p>
      </div>
    </body>
  </html>
  `;

  return sendEmail(email, "Your Hausa Wedding Guide PDF is Here!", emailHtml);
}

export function sendWebAppAccessEmail(email, txReference) {
  const userName = email.split("@")[0] || "Friend";

  // --- Construct the Signup/Access Link ---
  // Use VERCEL_URL or Netlify's URL environment variable
  const WEB_APP_BASE_URL =
    process.env.URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:5173");
  const signupUrl = `${WEB_APP_BASE_URL}/?guide=1&email=${encodeURIComponent(email)}`;

  // --- HTML Template replicating WebGuideEmail.jsx ---
  const emailHtml = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap');
        body { margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Inter', sans-serif; }
        .container { max-width: 600px; background-color: #ffffff; border-radius: 8px; margin: 40px auto; padding: 24px; border: 1px solid #eee; }
        .heading { font-family: 'Playfair Display', serif; color: #740015; font-size: 24px; font-weight: 700; line-height: 32px; margin-bottom: 16px; margin-top: 0; }
        .paragraph { color: #333; font-size: 16px; line-height: 24px; margin: 16px 0; }
        .button { background-color: #740015; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; }
        .link-text { font-size: 14px; color: #555; margin-bottom: 8px; margin-top: 24px;}
        .link-url { font-size: 12px; color: #777; word-break: break-all; text-decoration: none; }
        .hr { margin: 24px 0; border: none; border-top: 1px solid #eee; }
        .small-text { font-size: 14px; color: #555; line-height: 24px; margin: 16px 0; }
        .footer { font-size: 12px; color: #888; margin-top: 32px; text-align: center; }
        .footer-link { color: #CE805C; text-decoration: underline; }
        .logo-section { text-align: center; margin-bottom: 32px; }
        .logo { height: 60px; margin: 0 auto; border-radius: 8px; }
        .button-section { text-align: center; margin: 24px 0; }
        @media (max-width: 600px) { .container { width: 90% !important; margin: 20px auto !important; padding: 20px !important;} .button { padding: 12px 20px !important; font-size: 14px !important;} .heading { font-size: 20px !important; } .paragraph, .small-text, .link-text { font-size: 14px !important;} }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
           <img src="https://the-hausa-weding-guide.vercel.app/assets/logowhite.jpg" alt="Hausa Room Logo" class="logo" />
        </div>
        <h2 class="heading">Welcome, ${userName}!</h2>
        <p class="paragraph">
          Thank you for purchasing access to the <strong>Interactive Hausa Wedding Guide</strong> web application.
        </p>
        <p class="paragraph">
          Click the button below to create your account and start planning:
        </p>
        <div class="button-section">
          <a href="${signupUrl}" class="button">
            Create Account & Access Planner
          </a>
        </div>
        <p class="link-text">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <a href="${signupUrl}" class="link-url">${signupUrl}</a>
        <hr class="hr" />
        <p class="paragraph">
          Your purchase reference is: <strong>${txReference}</strong>
        </p>
        <p class="small-text">
          Your access starts from your first login and lasts for 20 days. Remember to export your personalized plan before it expires!
        </p>
        <p class="small-text">
          Enjoy planning your perfect wedding!
        </p>
        <p class="small-text">
          Sincerely,<br/>The Hausa Room Team
        </p>
        <hr class="hr" />
        <p class="footer">
          If you have questions, reply to this email or visit our <a href="https://the-hausa-weding-guide.vercel.app" class="footer-link">website</a>.
        </p>
      </div>
    </body>
  </html>
  `;

  return sendEmail(
    email,
    "Welcome to the Interactive Hausa Wedding Guide!",
    emailHtml
  );
}
