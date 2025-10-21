// File: api/email.js
import { Resend } from "resend";

// --- Initialize the Resend Client ---
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Sender Information ---
const fromEmail = "Hausa Room <support@hausaroom.com>"; // Client's verified domain

/**
 * Reusable function to send an email using Resend.
 */
async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY) {
    const errorMessage =
      "FATAL: RESEND_API_KEY is not set in environment variables.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error(`[EMAIL] ❌ Failed to send email to ${to}:`, error);
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
  // --- Define VERCEL_URL based base URL for assets ---
  const ASSET_BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://the-hausa-weding-guide.vercel.app"; // Fallback to your likely Vercel domain

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${ASSET_BASE_URL}/assets/logowhite.jpg" alt="Hausa Room Logo" height="60" style="border-radius: 8px;" />
        </div>
        <h2 style="color: #740015; font-family: 'Times New Roman', serif;">Hi ${userName},</h2>
        <p>Thank you for your purchase! Your Hausa Wedding Guide is ready for download.</p>
        <p>Please click the button below to get your PDF. This link will expire in <strong>24 hours</strong>.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${downloadLink}" style="background-color: #CE805C; color: white; padding: 12px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-weight: bold;">
            Download Your Guide
          </a>
        </div>
        <p style="font-size: 0.9em; color: #555;">If the button doesn't work, copy this link into your browser: ${downloadLink}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.9em; color: #555;">For support, contact support@hausaroom.com.</p>
        <p style="font-size: 0.9em; color: #555;">Sincerely,<br/>The Hausa Room Team</p>
      </div>
    </div>
  `;

  return sendEmail(email, "Your Hausa Wedding Guide PDF is Here!", emailHtml);
}

export function sendWebAppAccessEmail(email, txReference) {
  const userName = email.split("@")[0] || "Friend";

  // --- Construct the CORRECT Signup/Access Link using VERCEL_URL ---
  // Prioritize VERCEL_URL, fallback to Netlify's URL only if VERCEL_URL isn't set (e.g., during local Netlify dev)
  const WEB_APP_BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.URL || "http://localhost:5173"; // Use Netlify URL as fallback for local dev compatibility

  // --- Define VERCEL_URL based base URL for assets ---
  const ASSET_BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://the-hausa-weding-guide.vercel.app"; // Fallback to your likely Vercel domain

  // This link correctly directs the user to the application's login/signup flow
  const signupUrl = `${WEB_APP_BASE_URL}/?guide=1&email=${encodeURIComponent(email)}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${ASSET_BASE_URL}/assets/logowhite.jpg" alt="Hausa Room Logo" height="60" style="border-radius: 8px;" />
        </div>
        <h2 style="color: #740015; font-family: 'Times New Roman', serif;">Welcome, ${userName}!</h2>
        <p>Thank you for purchasing access to the <strong>Interactive Hausa Wedding Guide</strong> web application.</p>
        <p>Click the button below to create your account and start planning:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${signupUrl}" style="background-color: #740015; color: white; padding: 12px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-weight: bold;">
            Create Account & Access Planner
          </a>
        </div>
        <p style="font-size: 0.9em; color: #555;">If the button doesn't work, copy this link into your browser: ${signupUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p>Your purchase reference is: <strong>${txReference}</strong></p>
        <p style="font-size: 0.9em; color: #555;">Your access starts from your first login and lasts for 20 days. Make sure to export your plan!</p>
        <p style="font-size: 0.9em; color: #555;">Sincerely,<br/>The Hausa Room Team</p>
      </div>
    </div>
  `;

  return sendEmail(
    email,
    "Welcome to the Interactive Hausa Wedding Guide!",
    emailHtml
  );
}
