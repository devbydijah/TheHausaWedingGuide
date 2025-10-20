// File: api/email.js
import { Resend } from "resend";
import fs from "fs"; // Node.js File System
import path from "path"; // Node.js Path

// --- Initialize the Resend Client ---
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Sender Information ---
const fromEmail = "The Hausa Wedding Guide <contact@devwithdijah.com>";

// --- Helper function to read the pre-rendered HTML files ---
function getEmailTemplate(templateName) {
  try {
    // Path inside the API directory where templates are saved during build
    const templatePath = path.join(
      process.cwd(), // Project Root in Vercel build
      "api",
      "email-templates",
      templateName
    );
    // console.log(`[DEBUG] Reading template from: ${templatePath}`); // Optional debugging
    if (!fs.existsSync(templatePath)) {
      console.error(`[ERROR] Template file not found at: ${templatePath}`);
      return null;
    }
    return fs.readFileSync(templatePath, "utf-8");
  } catch (error) {
    console.error(`Error reading email template ${templateName}:`, error);
    return null; // Return null on error
  }
}

/**
 * Reusable function to send an email using Resend.
 */
async function sendEmail(to, subject, html) {
  // Add check if HTML is null or empty
  if (!html) {
    const errorMessage = `Cannot send email, HTML content for subject "${subject}" is missing or failed to load.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
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

  // 1. Get the pre-rendered HTML template
  let emailHtml = getEmailTemplate("pdf_guide_template.html");

  // If loading failed, throw error before trying to replace
  if (!emailHtml) {
    throw new Error("Could not load PDF email template. Check build logs.");
  }

  // 2. Replace placeholders with real data (use global flag 'g' for multiple occurrences)
  emailHtml = emailHtml
    .replace(/{{userName}}/g, userName)
    .replace(/{{downloadLink}}/g, downloadLink);

  // 3. Send the final HTML
  return sendEmail(email, "Your Hausa Wedding Guide PDF is Here!", emailHtml);
}

export function sendWebAppAccessEmail(email, txReference) {
  const userName = email.split("@")[0] || "Friend";

  // --- Construct the Signup/Access Link ---
  const WEB_APP_BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:5173";

  const signupUrl = `${WEB_APP_BASE_URL}/?guide=1&email=${encodeURIComponent(
    email
  )}`;

  // 1. Get the pre-rendered HTML template
  let emailHtml = getEmailTemplate("web_guide_template.html");

  // If loading failed, throw error before trying to replace
  if (!emailHtml) {
    throw new Error("Could not load Web App email template. Check build logs.");
  }

  // 2. Replace placeholders with real data (use global flag 'g')
  emailHtml = emailHtml
    .replace(/{{userName}}/g, userName)
    .replace(/{{signupUrl}}/g, signupUrl)
    .replace(/{{txReference}}/g, txReference);

  // 3. Send the final HTML
  return sendEmail(
    email,
    "Welcome to the Interactive Hausa Wedding Guide!",
    emailHtml
  );
}
