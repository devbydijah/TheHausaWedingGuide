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

export function sendDownloadEmail(email, firstName, downloadLink) {
  const userName = firstName || email.split("@")[0];
  // --- Determine Base URL for Assets (Vercel) ---
  const ASSET_BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://the-hausa-weding-guide.vercel.app"; // Fallback needed

  // --- HTML Template replicating PDFGuideEmail.jsx styling ---
  const emailHtml = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" type="text/css">
    <style>
      body { margin: 0; padding: 0; width: 100% !important; background-color: #f6f6f6; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      td { vertical-align: top; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      p { display: block; margin: 13px 0; }
      a { text-decoration: none; }
      .container { max-width: 600px; background-color: #ffffff; border-radius: 8px; margin: 40px auto; border: 1px solid #eee; overflow: hidden; }
      .content { padding: 24px; }
      .heading { font-family: 'Playfair Display', Georgia, serif; color: #740015; font-size: 24px; font-weight: 700; line-height: 32px; margin: 0 0 16px 0; }
      .paragraph { color: #333; font-size: 16px; line-height: 24px; margin: 16px 0; font-family: 'Inter', Arial, sans-serif; }
      .button { background-color: #CE805C; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; font-family: 'Inter', Arial, sans-serif; mso-padding-alt: 0; text-align: center; }
      /* Button hover effects won't work in most email clients, set desired state directly */
      .link-text { font-size: 14px; color: #555; margin: 24px 0 8px 0; font-family: 'Inter', Arial, sans-serif;}
      .link-url { font-size: 12px; color: #777; word-break: break-all; text-decoration: none; font-family: 'Inter', Arial, sans-serif;}
      .hr { margin: 24px 0; border: none; border-top: 1px solid #eee; }
      .small-text { font-size: 14px; color: #555; line-height: 24px; margin: 16px 0; font-family: 'Inter', Arial, sans-serif;}
      .footer { font-size: 12px; color: #888; margin-top: 32px; text-align: center; font-family: 'Inter', Arial, sans-serif;}
      .footer-link { color: #CE805C; text-decoration: underline; }
      .logo-section { text-align: center; padding: 20px 0; }
      .logo { height: 60px; border-radius: 8px; }
      .button-section { text-align: center; padding: 10px 0; }

      @media only screen and (max-width: 640px) {
        .container { width: 90% !important; margin: 20px auto !important; }
        .content { padding: 20px !important; }
        .heading { font-size: 22px !important; line-height: 30px !important; }
        .paragraph, .small-text, .link-text { font-size: 15px !important; line-height: 22px !important; }
        .button { padding: 12px 24px !important; font-size: 15px !important;}
      }
    </style>
  </head>
  <body>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" class="container">
            <tr>
              <td class="logo-section">
                <img src="${ASSET_BASE_URL}/assets/logowhite.jpg" alt="Hausa Room Logo" class="logo" />
              </td>
            </tr>
            <tr>
              <td class="content">
                <h2 class="heading">Hi ${userName},</h2>
                <p class="paragraph">
                  Thank you for your purchase! Your Hausa Wedding Guide is ready for download.
                </p>
                <p class="paragraph">
                  Please click the button below to get your PDF. This link will expire in <strong>24 hours</strong>.
                </p>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="button-section">
                  <tr>
                    <td align="center">
                      <a href="${downloadLink}" target="_blank" class="button" style="color: #ffffff; text-decoration: none; display: inline-block;">Download Your Guide</a>
                    </td>
                  </tr>
                </table>
                <p class="link-text">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <a href="${downloadLink}" target="_blank" class="link-url" style="color: #777; text-decoration: none;">${downloadLink}</a>
                <hr class="hr" />
                <p class="small-text">
                  If you have any issues, please contact our support team by replying to this email or sending a message to support@hausaroom.com.
                </p>
                <p class="small-text">
                  Sincerely,<br/>The Hausa Room Team
                </p>
                <hr class="hr" />
                <p class="footer">
                  You received this email because you purchased the Hausa Wedding Guide. Visit our <a href="${ASSET_BASE_URL}" class="footer-link" style="color: #CE805C;">website</a>.
                </p>
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
  // --- Determine Base URL for Links and Assets (Vercel) ---
  const WEB_APP_BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://the-hausa-weding-guide.vercel.app"; // Fallback needed
  const signupUrl = `${WEB_APP_BASE_URL}/?guide=1&email=${encodeURIComponent(email)}`;

  // --- HTML Template replicating WebGuideEmail.jsx styling ---
  const emailHtml = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" type="text/css">
    <style>
      body { margin: 0; padding: 0; width: 100% !important; background-color: #f6f6f6; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      td { vertical-align: top; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      p { display: block; margin: 13px 0; }
      a { text-decoration: none; }
      .container { max-width: 600px; background-color: #ffffff; border-radius: 8px; margin: 40px auto; border: 1px solid #eee; overflow: hidden; }
      .content { padding: 24px; }
      .heading { font-family: 'Playfair Display', Georgia, serif; color: #740015; font-size: 24px; font-weight: 700; line-height: 32px; margin: 0 0 16px 0; }
      .paragraph { color: #333; font-size: 16px; line-height: 24px; margin: 16px 0; font-family: 'Inter', Arial, sans-serif; }
      .button { background-color: #740015; color: #ffffff !important; border-radius: 8px; padding: 14px 28px; font-weight: 600; font-size: 16px; text-decoration: none; display: inline-block; font-family: 'Inter', Arial, sans-serif; mso-padding-alt: 0; text-align: center; }
      .link-text { font-size: 14px; color: #555; margin: 24px 0 8px 0; font-family: 'Inter', Arial, sans-serif;}
      .link-url { font-size: 12px; color: #777; word-break: break-all; text-decoration: none; font-family: 'Inter', Arial, sans-serif;}
      .hr { margin: 24px 0; border: none; border-top: 1px solid #eee; }
      .small-text { font-size: 14px; color: #555; line-height: 24px; margin: 16px 0; font-family: 'Inter', Arial, sans-serif;}
      .footer { font-size: 12px; color: #888; margin-top: 32px; text-align: center; font-family: 'Inter', Arial, sans-serif;}
      .footer-link { color: #CE805C; text-decoration: underline; }
      .logo-section { text-align: center; padding: 20px 0; }
      .logo { height: 60px; border-radius: 8px; }
      .button-section { text-align: center; padding: 10px 0; }

       @media only screen and (max-width: 640px) {
        .container { width: 90% !important; margin: 20px auto !important; }
        .content { padding: 20px !important; }
        .heading { font-size: 22px !important; line-height: 30px !important; }
        .paragraph, .small-text, .link-text { font-size: 15px !important; line-height: 22px !important; }
        .button { padding: 12px 24px !important; font-size: 15px !important;}
      }
    </style>
  </head>
  <body>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" class="container">
            <tr>
              <td class="logo-section">
                 <img src="${WEB_APP_BASE_URL}/assets/logowhite.jpg" alt="Hausa Room Logo" class="logo" />
              </td>
            </tr>
            <tr>
              <td class="content">
                <h2 class="heading">Welcome, ${userName}!</h2>
                <p class="paragraph">
                  Thank you for purchasing access to the <strong>Interactive Hausa Wedding Guide</strong> web application.
                </p>
                <p class="paragraph">
                  Click the button below to create your account and start planning:
                </p>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="button-section">
                   <tr>
                    <td align="center">
                       <a href="${signupUrl}" target="_blank" class="button" style="color: #ffffff; text-decoration: none; display: inline-block;">Create Account & Access Planner</a>
                    </td>
                  </tr>
                </table>
                <p class="link-text">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <a href="${signupUrl}" target="_blank" class="link-url" style="color: #777; text-decoration: none;">${signupUrl}</a>
                <hr class="hr" />
                <p class="paragraph" style="font-size: 14px;">
                  Your purchase reference is: <strong>${txReference}</strong>
                </p>
                <p class="small-text">
                  Your access starts from your first login and lasts for 20 days. Remember to export your personalized plan before it expires!
                </p>
                 <p class="small-text">
                  If you have any issues, please contact our support team by replying to this email or sending a message to support@hausaroom.com.
                </p>
                <p class="small-text">
                  Sincerely,<br/>The Hausa Room Team
                </p>
                <hr class="hr" />
                 <p class="footer">
                   You received this email because you purchased the Interactive Hausa Wedding Guide. Visit our <a href="${WEB_APP_BASE_URL}" class="footer-link" style="color: #CE805C;">website</a>.
                 </p>
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
