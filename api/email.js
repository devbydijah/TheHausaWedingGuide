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

// --- Specific Email Functions ---

export function sendDownloadEmail(email, firstName, downloadLink) {
  const userName = firstName || email.split("@")[0];
  // --- Determine Base URL for Assets (Vercel) ---
  const BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://the-hausa-weding-guide.vercel.app"; // Fallback needed

  // --- HTML Template for PDF Guide ---
  const emailHtml = `
  <img src="https://nhmuzzvuwcecgfejdmyi.supabase.co/storage/v1/object/public/logopublic/logowhite.svg" alt="Logo" style="width: 100px; height: auto;" />
  <div class="container">
      <div class="header">
        <img src="https://nhmuzzvuwcecgfejdmyi.supabase.co/storage/v1/object/public/logopublic/logowhite.svg" alt="Logo" style="width: 100px; height: auto;" />
      </div>
      <div class="content">
        <h2 class="heading">Hi ${userName},</h2>
        <p class="paragraph">Thank you for your purchase! Your Hausa Wedding Guide is ready for download.</p>
        <p class="paragraph">Please click the button below to get your PDF. This link will expire in <strong>24 hours</strong>.</p>
        <div class="button-container">
          <a href="${downloadLink}" target="_blank" class="button">Download Your Guide</a>
        </div>
        <div class="link-info">
          If the button doesn't work, copy/paste this link:<br>
          <span class="link-url">${downloadLink}</span>
        </div>
        <hr class="hr" />
        <p class="paragraph" style="font-size: 14px; color: #6b7280;">Questions? Contact us at <a href="mailto:support@hausaroom.com" style="color: #740015;">support@hausaroom.com</a>.</p>
        <p class="paragraph" style="font-size: 14px; color: #6b7280;">Sincerely,<br/>The Hausa Room Team</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Hausa Room. All rights reserved. <a href="${BASE_URL}">Visit Website</a>
      </div>
    </div>
  </body>
  </html>
  `;

  return sendEmail(email, "Your Hausa Wedding Guide PDF is Here!", emailHtml);
}

export function sendWebAppAccessEmail(email, firstName, txReference) {
  const userName = firstName || email.split("@")[0];
  const BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://the-hausa-weding-guide.vercel.app";
  const signupUrl = `${BASE_URL}/?guide=1&email=${encodeURIComponent(email)}`;
  const logoUrl = `${BASE_URL}/assets/logowhite.jpg`;

  const emailHtml = `
  <img src="https://nhmuzzvuwcecgfejdmyi.supabase.co/storage/v1/object/public/logopublic/logowhite.svg" alt="Logo" style="width: 100px; height: auto;" />
  <div class="container">
      <div class="header">
        <img src="https://nhmuzzvuwcecgfejdmyi.supabase.co/storage/v1/object/public/logopublic/logowhite.svg" alt="Logo" style="width: 100px; height: auto;" />
      </div>
      <div class="content">
        <h2 class="heading">Welcome, ${userName}!</h2>
        <p class="paragraph">Thank you for purchasing access to the <strong>Interactive Hausa Wedding Guide</strong>.</p>
        <p class="paragraph">Click the button below to create your account and start planning:</p>
        <div class="button-container">
          <a href="${signupUrl}" target="_blank" class="button">Create Account & Access Planner</a>
        </div>
        <div class="link-info">
          If the button doesn't work, copy/paste this link:<br>
          <span class="link-url">${signupUrl}</span>
        </div>
        <hr class="hr" />
        <p class="paragraph" style="font-size: 14px;">Your purchase reference is: <strong>${txReference}</strong></p>
        <p class="small-text">Your access starts from your first login and lasts for 20 days. Remember to export your personalized plan before it expires!</p>
        <p class="small-text">Questions? Contact us at <a href="mailto:support@hausaroom.com" style="color: #740015;">support@hausaroom.com</a>.</p>
        <p class="small-text">Sincerely,<br/>The Hausa Room Team</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Hausa Room. All rights reserved. <a href="${BASE_URL}">Visit Website</a>
      </div>
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

// --- *** ADDED Bundle Email Function *** ---
export function sendBundleEmail(
  email,
  firstName,
  txReference,
  downloadLink,
  signupUrl
) {
  const userName = firstName || email.split("@")[0];
  const siteUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://the-hausa-weding-guide.vercel.app";
  const logoUrl = `${siteUrl}/assets/logowhite.jpg`; // Correct path to JPG in public/assets folder

  // --- HTML Template for Bundle Purchase ---
  const emailHtml = `
  <img src="https://nhmuzzvuwcecgfejdmyi.supabase.co/storage/v1/object/public/logopublic/logowhite.svg" alt="Logo" style="width: 100px; height: auto;" />
  <div class="container">
      <div class="header">
        <img src="https://nhmuzzvuwcecgfejdmyi.supabase.co/storage/v1/object/public/logopublic/logowhite.svg" alt="Logo" style="width: 100px; height: auto;" />
      </div>
      <div class="content">
        <h2 class="heading">Thank You, ${userName}!</h2>
        <p class="paragraph">You've got the best of both worlds! Thank you for purchasing the <strong>Hausa Wedding Guide Bundle</strong>.</p>
        <p class="paragraph">Below you'll find links to download your PDF guide and access the interactive web planner.</p>

        <hr class="hr" />

        <h3 class="subheading">Your PDF Guide:</h3>
        <p class="paragraph" style="font-size: 14px;">Click the button below to download your comprehensive PDF guide. Remember, this link is unique to you and expires in <strong>24 hours</strong>.</p>
        <div class="button-container">
          <a href="${downloadLink}" target="_blank" class="button-pdf">Download PDF Guide</a>
        </div>
        <p class="link-info">
          PDF Link: <a href="${downloadLink}" target="_blank" class="link-url" style="color: #9ca3af;">${downloadLink}</a>
        </p>

        <hr class="hr" />

        <h3 class="subheading">Your Interactive Planner:</h3>
        <p class="paragraph" style="font-size: 14px;">Click the button below to create your account or log in. Your access lasts for <strong>20 days</strong> from your first login.</p>
        <div class="button-container">
          <a href="${signupUrl}" target="_blank" class="button-webapp">Access Interactive Planner</a>
        </div>
         <p class="link-info">
          Planner Link: <a href="${signupUrl}" target="_blank" class="link-url" style="color: #9ca3af;">${signupUrl}</a>
        </p>

        <hr class="hr" />

        <p class="paragraph" style="font-size: 14px;">Your purchase reference is: <strong>${txReference}</strong></p>
        <p class="paragraph" style="font-size: 14px; color: #6b7280;">Questions? Contact us at <a href="mailto:support@hausaroom.com" style="color: #740015;">support@hausaroom.com</a>.</p>
        <p class="paragraph" style="font-size: 14px; color: #6b7280;">Sincerely,<br/>The Hausa Room Team</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Hausa Room. All rights reserved. <a href="${siteUrl}">Visit Website</a>
      </div>
    </div>
  </body>
  </html>
  `;

  return sendEmail(email, "Your Hausa Wedding Guide Bundle Access!", emailHtml);
}
