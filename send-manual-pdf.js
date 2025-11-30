import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables from .env.production FIRST
dotenv.config({ path: ".env.production" });

// Now dynamically import email module after env vars are loaded
const { sendDownloadEmail } = await import("./api/email.js");

// Customer details
const email = "itsdrmadina@gmail.com";
const firstName = "Dr. Madina"; // Update with actual name if available
const mode = "live";

// Generate secure download link
const token = crypto.randomBytes(32).toString("hex");
const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
const SECRET = process.env.DOWNLOAD_TOKEN_SECRET_LIVE;

if (!SECRET) {
  console.error("❌ DOWNLOAD_TOKEN_SECRET_LIVE not found in environment!");
  process.exit(1);
}

const hmac = crypto.createHmac("sha256", SECRET);
hmac.update(`${token}|${email}|${expires}`);
const sig = hmac.digest("hex");

const BASE_URL = "https://the-hausa-weding-guide.vercel.app";
const downloadLink = `${BASE_URL}/api/pdf-download?token=${token}&expires=${expires}&email=${encodeURIComponent(email)}&sig=${sig}&mode=${mode}`;

// Send email
console.log(`📧 Sending PDF to ${email}...`);
console.log(`🔗 Download link: ${downloadLink}`);

try {
  await sendDownloadEmail(email, firstName, downloadLink);
  console.log(`✅ PDF email sent successfully to ${email}!`);
} catch (error) {
  console.error("❌ Error sending email:", error.message);
  process.exit(1);
}
