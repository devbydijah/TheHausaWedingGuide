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

// --- Common Variables ---
const BASE_URL = "https://the-hausa-weding-guide.vercel.app";
// --- FIX: Use the correct absolute path to the logo ---
const LOGO_URL =
  "https://the-hausa-weding-guide.vercel.app/assets/logowhite.jpg";

// --- Email Templates ---

export function sendDownloadEmail(email, firstName, downloadLink) {
  const userName = firstName || email.split("@")[0];

  const emailHtml = `
  <!DOCTYPE html>
  <html lang="en" style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0;">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
      body { margin: 0; background-color: #f9f4f1; color: #374151; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
      .header { padding: 32px; text-align: center; background-color: #f9f4f1; }
      .content { padding: 32px; }
      .heading { font-family: 'Playfair Display', serif; color: #740015; font-size: 26px; font-weight: 700; margin: 0 0 16px; }
      .paragraph { font-size: 16px; line-height: 1.6; margin: 16px 0; }
      .button-container { text-align: center; padding: 20px 0; }
      .button { background-color: #CE805C; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; border: none; cursor: pointer; }
      .link-info { font-size: 14px; color: #6b7280; text-align: center; margin-top: 24px; }
      .link-url { font-size: 12px; color: #9ca3af; word-break: break-all; }
      .hr { margin: 30px 0; border: none; border-top: 1px solid #e5e7eb; }
      .footer { font-size: 12px; color: #9ca3af; text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; }
      .footer a { color: #740015; text-decoration: none; }
    </style>
  </head>
  <body style="margin: 0; background-color: #f9f4f1; font-family: 'Inter', Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f4f1;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
            <tr>
              <td class="header" style="padding: 32px; text-align: center; background-color: #f9f4f1;">
                <img src="${LOGO_URL}" alt="Hausa Room Logo" height="60" style="border-radius: 8px;" />
              </td>
            </tr>
            <tr>
              <td class="content" style="padding: 32px;">
                <h2 class="heading" style="font-family: 'Playfair Display', serif; color: #740015; font-size: 26px; font-weight: 700; margin: 0 0 16px;">Hi ${userName},</h2>
                <p class="paragraph" style="font-size: 16px; line-height: 1.6; margin: 16px 0;">Thank you for your purchase! Your Hausa Wedding Guide is ready for download.</p>
                <p class="paragraph" style="font-size: 16px; line-height: 1.6; margin: 16px 0;">Please click the button below to get your PDF. This link will expire in <strong>24 hours</strong>.</p>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="button-container" style="text-align: center; padding: 20px 0;">
                  <tr>
                    <td align="center">
                      <a href="${downloadLink}" target="_blank" class="button" style="background-color: #CE805C; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; border: none; cursor: pointer;">Download Your Guide</a>
                    </td>
                  </tr>
                </table>
                <div class="link-info" style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 24px;">
                  If the button doesn't work, copy/paste this link:<br>
                  <span class="link-url" style="font-size: 12px; color: #9ca3af; word-break: break-all;">${downloadLink}</span>
                </div>
                <hr class="hr" style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
                <p class="paragraph" style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 16px 0;">Questions? Contact us at <a href="mailto:support@hausaroom.com" style="color: #740015; text-decoration: none;">support@hausaroom.com</a>.</p>
                <p class="paragraph" style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 16px 0;">Sincerely,<br/>The Hausa Room Team</p>
              </td>
            </tr>
            <tr>
              <td class="footer" style="font-size: 12px; color: #9ca3af; text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                © ${new Date().getFullYear()} Hausa Room. All rights reserved. <a href="${BASE_URL}" style="color: #740015; text-decoration: none;">Visit Website</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  return sendEmail(email, "Your Hausa Wedding Guide PDF is Here!", emailHtml);
}

export function sendWebAppAccessEmail(email, firstName, txReference) {
  const userName = firstName || email.split("@")[0];
  const signupUrl = `${BASE_URL}/?guide=1&email=${encodeURIComponent(email)}`;

  const emailHtml = `
  <!DOCTYPE html>
  <html lang="en" style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0;">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
      body { margin: 0; background-color: #f9f4f1; color: #374151; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
      .header { padding: 32px; text-align: center; background-color: #f9f4f1; }
      .content { padding: 32px; }
      .heading { font-family: 'Playfair Display', serif; color: #740015; font-size: 26px; font-weight: 700; margin: 0 0 16px; }
      .paragraph { font-size: 16px; line-height: 1.6; margin: 16px 0; }
      .button-container { text-align: center; padding: 20px 0; }
      .button { background-color: #740015; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; border: none; cursor: pointer;}
      .link-info { font-size: 14px; color: #6b7280; text-align: center; margin-top: 24px; }
      .link-url { font-size: 12px; color: #9ca3af; word-break: break-all; }
      .hr { margin: 30px 0; border: none; border-top: 1px solid #e5e7eb; }
      .small-text { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 16px 0; }
      .footer { font-size: 12px; color: #9ca3af; text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; }
      .footer a { color: #740015; text-decoration: none; }
    </style>
  </head>
  <body style="margin: 0; background-color: #f9f4f1; font-family: 'Inter', Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
            <tr>
              <td class="header" style="padding: 32px; text-align: center; background-color: #f9f4f1;">
                <img src="${LOGO_URL}" alt="Hausa Room Logo" height="60" style="border-radius: 8px;" />
              </td>
            </tr>
            <tr>
              <td class="content" style="padding: 32px;">
                <h2 class="heading" style="font-family: 'Playfair Display', serif; color: #740015; font-size: 26px; font-weight: 700; margin: 0 0 16px;">Welcome, ${userName}!</h2>
                <p class="paragraph" style="font-size: 16px; line-height: 1.6; margin: 16px 0;">Thank you for purchasing access to the <strong>Interactive Hausa Wedding Guide</strong>.</p>
                <p class="paragraph" style="font-size: 16px; line-height: 1.6; margin: 16px 0;">Click the button below to create your account and start planning:</p>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="button-container" style="text-align: center; padding: 20px 0;">
                  <tr>
                    <td align="center">
                      <a href="${signupUrl}" target="_blank" class="button" style="background-color: #740015; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; border: none; cursor: pointer;">Create Account & Access Planner</a>
                    </td>
                  </tr>
                </table>
                <div class="link-info" style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 24px;">
                  If the button doesn't work, copy/paste this link:<br>
                  <span class="link-url" style="font-size: 12px; color: #9ca3af; word-break: break-all;">${signupUrl}</span>
                </div>
                <hr class="hr" style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
                <p class="paragraph" style="font-size: 14px; line-height: 1.6; margin: 16px 0;">Your purchase reference is: <strong>${txReference}</strong></p>
                <p class="small-text" style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 16px 0;">Your access starts from your first login and lasts for 20 days. Remember to export your personalized plan before it expires!</p>
                <p class="small-text" style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 16px 0;">Questions? Contact us at <a href="mailto:support@hausaroom.com" style="color: #740015; text-decoration: none;">support@hausaroom.com</a>.</p>
                <p class="small-text" style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 16px 0;">Sincerely,<br/>The Hausa Room Team</p>
              </td>
            </tr>
            <tr>
              <td class="footer" style="font-size: 12px; color: #9ca3af; text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                © ${new Date().getFullYear()} Hausa Room. All rights reserved. <a href="${BASE_URL}" style="color: #740015; text-decoration: none;">Visit Website</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  return sendEmail(
    email,
    "Welcome to the Interactive Hausa Wedding Guide!",
    emailHtml
  );
}

// --- *** Bundle Email Function *** ---
export function sendBundleEmail(
  email,
  firstName,
  txReference,
  downloadLink,
  signupUrl
) {
  const userName = firstName || email.split("@")[0];

  // --- HTML Template for Bundle Purchase (New Design) ---
  const emailHtml = `
  <!DOCTYPE html>
  <html lang="en" style="font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0;">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
      body { margin: 0; background-color: #f9f4f1; color: #374151; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
      .header { padding: 32px; text-align: center; background-color: #f9f4f1; }
      .content { padding: 32px; }
      .heading { font-family: 'Playfair Display', serif; color: #740015; font-size: 26px; font-weight: 700; margin: 0 0 16px; }
      .subheading { font-family: 'Playfair Display', serif; color: #740015; font-size: 20px; font-weight: 700; margin: 24px 0 10px 0; }
      .paragraph { font-size: 16px; line-height: 1.6; margin: 16px 0; }
      .button-container { text-align: center; padding: 15px 0; }
      .button-pdf { background-color: #CE805C; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; border: none; cursor: pointer; margin-bottom: 15px;}
      .button-webapp { background-color: #740015; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; border: none; cursor: pointer;}
      .link-info { font-size: 14px; color: #6b7280; text-align: center; margin-top: 10px; }
      .link-url { font-size: 12px; color: #9ca3af; word-break: break-all; }
      .hr { margin: 30px 0; border: none; border-top: 1px solid #e5e7eb; }
      .footer { font-size: 12px; color: #9ca3af; text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; }
      .footer a { color: #740015; text-decoration: none; }
    </style>
  </head>
  <body style="margin: 0; background-color: #f9f4f1; font-family: 'Inter', Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
            <tr>
              <td class="header" style="padding: 32px; text-align: center; background-color: #f9f4f1;">
                <img src="${LOGO_URL}" alt="Hausa Room Logo" height="60" style="border-radius: 8px;" />
              </td>
            </tr>
            <tr>
              <td class="content" style="padding: 32px;">
                <h2 class="heading" style="font-family: 'Playfair Display', serif; color: #740015; font-size: 26px; font-weight: 700; margin: 0 0 16px;">Thank You, ${userName}!</h2>
                <p class="paragraph" style="font-size: 16px; line-height: 1.6; margin: 16px 0;">You've got the best of both worlds! Thank you for purchasing the <strong>Hausa Wedding Guide Bundle</strong>.</p>
                <p class="paragraph" style="font-size: 16px; line-height: 1.6; margin: 16px 0;">Below you'll find links to download your PDF guide and access the interactive web planner.</p>

                <hr class="hr" style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

                <h3 class="subheading" style="font-family: 'Playfair Display', serif; color: #740015; font-size: 20px; font-weight: 700; margin: 24px 0 10px 0;">Your PDF Guide:</h3>
                <p class="paragraph" style="font-size: 14px; line-height: 1.6; margin: 16px 0;">Click the button below to download your comprehensive PDF guide. Remember, this link is unique to you and expires in <strong>24 hours</strong>.</p>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="button-container" style="text-align: center; padding: 15px 0;">
                   <tr>
                    <td align="center">
                      <a href="${downloadLink}" target="_blank" class="button-pdf" style="background-color: #CE805C; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; border: none; cursor: pointer; margin-bottom: 15px;">Download PDF Guide</a>
                    </td>
                  </tr>
                </table>
                <p class="link-info" style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 10px;">
                  PDF Link: <a href="${downloadLink}" target="_blank" class="link-url" style="color: #9ca3af; word-break: break-all; text-decoration: none;">${downloadLink}</a>
                </p>

                <hr class="hr" style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

                <h3 class="subheading" style="font-family: 'Playfair Display', serif; color: #740015; font-size: 20px; font-weight: 700; margin: 24px 0 10px 0;">Your Interactive Planner:</h3>
                <p class="paragraph" style="font-size: 14px; line-height: 1.6; margin: 16px 0;">Click the button below to create your account or log in. Your access lasts for <strong>20 days</strong> from your first login.</p>
                 <table border="0" cellpadding="0" cellspacing="0" width="100%" class="button-container" style="text-align: center; padding: 15px 0;">
                   <tr>
                    <td align="center">
                      <a href="${signupUrl}" target="_blank" class="button-webapp" style="background-color: #740015; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; border: none; cursor: pointer;">Access Interactive Planner</a>
                    </td>
                  </tr>
                </table>
                 <p class="link-info" style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 10px;">
                  Planner Link: <a href="${signupUrl}" target="_blank" class="link-url" style="color: #9ca3af; word-break: break-all; text-decoration: none;">${signupUrl}</a>
                </p>

                <hr class="hr" style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

                <p class="paragraph" style="font-size: 14px; line-height: 1.6; margin: 16px 0;">Your purchase reference is: <strong>${txReference}</strong></p>
                <p class="paragraph" style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 16px 0;">Questions? Contact us at <a href="mailto:support@hausaroom.com" style="color: #740015; text-decoration: none;">support@hausaroom.com</a>.</p>
                <p class="paragraph" style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 16px 0;">Sincerely,<br/>The Hausa Room Team</p>
              </td>
            </tr>
            <tr>
              <td class="footer" style="font-size: 12px; color: #9ca3af; text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                © ${new Date().getFullYear()} Hausa Room. All rights reserved. <a href="${siteUrl}" style="color: #740015; text-decoration: none;">Visit Website</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  return sendEmail(email, "Your Hausa Wedding Guide Bundle Access!", emailHtml);
}
