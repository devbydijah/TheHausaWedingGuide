import { Resend } from "resend";
import PDFGuideEmail from "../../emails/PDFGuideEmail.jsx";
import WebGuideEmail from "../../emails/WebGuideEmail.jsx";

// --- Initialize the Resend Client ---
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Sender Information ---
const FROM_ADDRESS = process.env.FROM_EMAIL;

/**
 * Reusable function to send an email using Resend.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {React.ReactElement} react - The React Email component.
 */
async function sendEmail(to, subject, react) {
  if (!process.env.RESEND_API_KEY || !FROM_ADDRESS) {
    const errorMessage =
      "FATAL: RESEND_API_KEY or FROM_EMAIL is not set in environment variables.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    console.log(
      `[EMAIL] Attempting to send email to ${to} with subject "${subject}"`
    );
    const { data, error } = await resend.emails.send({
      from: "Hausa Room <" + FROM_ADDRESS + ">",
      to: [to],
      subject: subject,
      react: react,
    });

    if (error) {
      console.error(`[EMAIL] ❌ Failed to send email to ${to}:`, error);
      throw error;
    }

    console.log(`[EMAIL] ✅ Successfully sent email. Message ID: ${data.id}`);
    return data;
  } catch (error) {
    // Log the detailed API error from Resend for better debugging
    console.error("Resend API Error Body:", JSON.stringify(error, null, 2));
    throw error;
  }
}

// --- Specific Email Functions ---

export function sendDownloadEmail(email, downloadLink) {
  return sendEmail(
    email,
    "Your Northern Wedding PDF Guide by Hausa Room",
    <PDFGuideEmail name={email.split("@")[0]} downloadUrl={downloadLink} />
  );
}

export function sendWebAppAccessEmail(email, txReference) {
  const WEB_APP_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;
  return sendEmail(
    email,
    "Your Northern Wedding Interactive Guide by Hausa Room",
    <WebGuideEmail name={email.split("@")[0]} signupUrl={signupUrl} />
  );
}
