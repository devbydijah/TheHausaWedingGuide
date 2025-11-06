// File: api/email.js
import { Resend } from "resend";

// --- Initialize the Resend Client ---
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// --- Sender Information ---
const fromEmail = "Hausa Room <support@hausaroom.com>"; // Client's verified domain
const logoUrl =
  "https://nhmuzzvuwcecgfejdmyi.supabase.co/storage/v1/object/public/logopublic/logowhite.jpg"; // Supabase logo URL
const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://the-hausa-weding-guide.vercel.app"; // Fallback needed for site link in footer

/**
 * Reusable function to send an email using Resend.
 */
async function sendEmail(to, subject, html) {
  if (!resend) {
    const errorMessage =
      "FATAL: RESEND_API_KEY is not set. Email functionality disabled.";
    console.error(`[EMAIL] ${errorMessage}`);
    return {
      data: null,
      error: { name: "MissingApiKeyError", message: errorMessage },
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to], // Resend expects an array
      subject: subject,
      html: html,
    });

    if (error) {
      console.error(`[EMAIL] ❌ Failed to send email to ${to}:`, error.message);
      if (error.response && error.response.body) {
        console.error(
          "Resend API Error Body:",
          JSON.stringify(error.response.body, null, 2)
        );
      }
      return { data: null, error }; // Return the error object for handling
    }

    console.log(
      `[EMAIL] ✅ Successfully sent email to ${to}. Message ID: ${data?.id}`
    );
    return { data, error: null }; // Return data on success
  } catch (error) {
    console.error(`[EMAIL] Fatal error during sendEmail to ${to}:`, error);
    return {
      data: null,
      error: {
        name: "SendEmailError",
        message: "Internal server error during email sending.",
      },
    }; // Return a generic error
  }
}

/**
 * Generates the full HTML email body using a base template.
 * Matches the design provided by the user.
 */
function createBaseEmailHtml(subject, contentHtml) {
  const currentYear = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap');
      body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      table { border-collapse: collapse; }
      h1, h2, h3 { font-family: 'Playfair Display', 'Times New Roman', serif; color: #740015; margin: 0; }
      a.button { display: inline-block; background-color: #740015; color: #ffffff !important; font-family: 'Inter', Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none !important; padding: 14px 28px; border-radius: 6px; border: 1px solid #740015; }
      a.button-secondary { display: inline-block; background-color: #CE805C; color: #ffffff !important; font-family: 'Inter', Arial, sans-serif; font-size: 15px; font-weight: bold; text-decoration: none !important; padding: 12px 24px; border-radius: 6px; border: 1px solid #CE805C; }
      a { color: #740015; text-decoration: underline; }
      p { margin: 0 0 1em 0; color: #333333; font-size: 16px; line-height: 1.6; }
      .footer-link { color: #888888; text-decoration: none; }
      .content-cell { padding: 40px 30px 30px 30px; }
      .link-info { font-size: 12px; color: #6b7280; margin-top: 25px; padding-top: 15px; border-top: 1px solid #eeeeee; word-break: break-all; }
      .link-info a { color: #740015; }
      hr.separator { border: none; border-top: 1px solid #eeeeee; margin: 30px 0; }
      .subheading { color: #740015; font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 22px; margin: 0 0 15px 0; }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding: 20px 0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" style="background-color: #740015; padding: 40px 20px;">
                <img src="${logoUrl}" alt="Hausa Room Logo" width="120" style="display: block; width: 120px; height: auto;">
              </td>
            </tr>
            <tr>
              <td style="background-color: #D4A574; height: 5px; line-height: 5px; font-size: 5px;">&nbsp;</td>
            </tr>
            <tr>
              <td class="content-cell">
                ${contentHtml} <p style="margin: 30px 0 0 0;">
                   Warm regards,<br>
                   The Hausa Room Team
                 </p>
                 <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                   Questions? Contact us at <a href="mailto:support@hausaroom.com" style="color: #740015; text-decoration: underline;">support@hausaroom.com</a>.
                 </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; background-color: #f9f9f9; text-align: center; color: #888888; font-family: 'Inter', Arial, sans-serif; font-size: 12px; line-height: 1.5;">
                <p style="margin: 0 0 10px 0;">© ${currentYear} Hausa Room. All rights reserved.</p>
                <p style="margin: 0;">You are receiving this email because you made a purchase on our website. <a href="${siteUrl}" target="_blank" class="footer-link">Visit Website</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// --- Specific Email Functions ---

export function sendDownloadEmail(email, firstName, downloadLink) {
  const userName = firstName || email.split("@")[0];
  const subject = "Your Hausa Wedding Guide PDF is Here!";

  const contentHtml = `
    <h1 style="color: #740015; font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 28px; margin: 0 0 20px 0;">
      Your Guide is Ready!
    </h1>
    <p>Hi ${userName},</p>
    <p>Thank you for your purchase! Your Hausa Wedding Guide (PDF) is ready for download.</p>
    <p>Please click the button below to get your PDF. This link is unique to you and will expire in <strong>24 hours</strong>.</p>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
      <tr>
        <td align="center">
          <a href="${downloadLink}" target="_blank" class="button">
            Download Your Guide (PDF)
          </a>
        </td>
      </tr>
    </table>
    <p class="link-info">
      If the button doesn't work, copy/paste this link into your browser:<br>
      <a href="${downloadLink}" target="_blank">${downloadLink}</a>
    </p>
  `;

  const emailHtml = createBaseEmailHtml(subject, contentHtml);
  return sendEmail(email, subject, emailHtml);
}

export function sendWebAppAccessEmail(email, firstName, txReference) {
  const userName = firstName || email.split("@")[0];
  const signupUrl = `${siteUrl}/?guide=1&email=${encodeURIComponent(email)}`;
  const subject = "Welcome to the Interactive Hausa Wedding Guide!";

  const contentHtml = `
    <h1 style="color: #740015; font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 28px; margin: 0 0 20px 0;">
      Welcome, ${userName}!
    </h1>
    <p>Thank you for purchasing access to the <strong>Interactive Hausa Wedding Guide</strong>. We're excited to help you plan your special day!</p>
    <p>Click the button below to create your account and start planning using our dynamic tools:</p>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
      <tr>
        <td align="center">
          <a href="${signupUrl}" target="_blank" class="button">
            Create Account & Access Planner
          </a>
        </td>
      </tr>
    </table>
     <p style="font-size: 14px; margin-top: 30px;">
       Your purchase reference is: <strong>${txReference}</strong>
     </p>
     <p style="font-size: 14px; color: #6b7280;">
       Your access starts from your first login and lasts for <strong>20 days</strong>. Remember to export your personalized plan before access expires!
     </p>
    <p class="link-info">
      If the button doesn't work, copy/paste this link into your browser:<br>
      <a href="${signupUrl}" target="_blank">${signupUrl}</a>
    </p>
  `;

  const emailHtml = createBaseEmailHtml(subject, contentHtml);
  return sendEmail(email, subject, emailHtml);
}

export function sendBundleEmail(
  email,
  firstName,
  txReference,
  downloadLink,
  signupUrl
) {
  const userName = firstName || email.split("@")[0];
  const subject = "Your Hausa Wedding Guide Bundle Access!";

  const contentHtml = `
    <h1 style="color: #740015; font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 28px; margin: 0 0 20px 0;">
      Thank You for the Bundle Purchase!
    </h1>
    <p>Hi ${userName},</p>
    <p>You've got the best of both worlds! Thank you for purchasing the <strong>Hausa Wedding Guide Bundle</strong>.</p>
    <p>Below you'll find links to download your PDF guide and access the interactive web planner.</p>

    <hr class="separator">

    <h2 class="subheading">Your PDF Guide</h2>
    <p style="font-size: 14px; margin-bottom: 25px;">
      Click the button below to download your comprehensive PDF guide. Remember, this link is unique to you and expires in <strong>24 hours</strong>.
    </p>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
      <tr>
        <td align="center">
          <a href="${downloadLink}" target="_blank" class="button-secondary">
            Download PDF Guide
          </a>
        </td>
      </tr>
    </table>
    <p class="link-info" style="border-top: none; padding-top: 0; margin-top: 5px;">
      PDF Link (if button fails): <a href="${downloadLink}" target="_blank">${downloadLink}</a>
    </p>

    <hr class="separator">

    <h2 class="subheading">Your Interactive Planner</h2>
    <p style="font-size: 14px; margin-bottom: 25px;">
      Click the button below to create your account or log in. Your access lasts for <strong>20 days</strong> from your first login.
    </p>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
      <tr>
        <td align="center">
          <a href="${signupUrl}" target="_blank" class="button">
            Access Interactive Planner
          </a>
        </td>
      </tr>
    </table>
     <p class="link-info" style="border-top: none; padding-top: 0; margin-top: 5px;">
       Planner Link (if button fails): <a href="${signupUrl}" target="_blank">${signupUrl}</a>
     </p>

     <hr class="separator">

     <p style="font-size: 14px; margin-top: 30px;">
       Your purchase reference is: <strong>${txReference}</strong>
     </p>
  `;

  const emailHtml = createBaseEmailHtml(subject, contentHtml);
  return sendEmail(email, subject, emailHtml);
}
