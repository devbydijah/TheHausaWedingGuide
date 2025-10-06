// Simple email service using Resend
import { Resend } from "resend";
import { logger } from "./logger.js";

const resend = new Resend(process.env.RESEND_API_KEY);

// Shared password from environment (for web app access)
const SHARED_PASSWORD = process.env.VITE_SHARED_PASSWORD || "hausawedding2025";
const WEB_APP_URL =
  process.env.WEB_APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:5173";

/**
 * Send PDF download email (existing functionality)
 */
export async function sendDownloadEmail(email, downloadLink) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@hausaroom.com",
      to: [email],
      subject: "Your Hausa Wedding Guide – Download Link",
      html: `
        <div style="font-family: Inter, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#faf7f6; margin:0; padding:24px;">
          <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.06)">
            <!-- Header -->
            <div style="background: linear-gradient(135deg,#990200,#531946); padding:20px 24px; color:#fff;">
              <div style="font-size:18px; font-weight:700; letter-spacing:.2px;">Hausa Wedding Guide</div>
              <div style="opacity:.9; font-size:13px; margin-top:4px;">Your purchase is confirmed</div>
            </div>
            
            <!-- Body -->
            <div style="padding:24px">
              <h1 style="margin:0 0 8px; font-size:20px; color:#1e1e1e;">Your guide is ready</h1>
              <p style="margin:0 0 16px; color:#444; font-size:14px; line-height:1.6">
                Click the button below to download your Hausa Wedding Guide. This link is secure and temporary.
              </p>

              <div style="text-align:center; margin:20px 0 8px">
                <a href="${downloadLink}" style="display:inline-block; background:#CE805C; color:#fff; text-decoration:none; padding:12px 20px; border-radius:10px; font-weight:600; font-size:15px;">
                  Download Your Guide
                </a>
              </div>
              <p style="margin:8px 0 0; color:#666; font-size:12px; text-align:center; word-break:break-all;">If the button doesn’t work, copy and paste this link in your browser:<br>
                <span style="color:#990200">${downloadLink}</span>
              </p>

              <div style="margin-top:20px; padding:12px 14px; background:#f6faf7; border:1px solid #e3efe5; border-radius:12px; color:#234; font-size:12px; line-height:1.6">
                <strong style="display:block; color:#0a5; margin-bottom:4px">Important</strong>
                <ul style="margin:0; padding-left:16px">
                  <li>This link expires in 24 hours.</li>
                  <li>We do not resend download links by email.</li>
                  <li>Please use the same email you used at checkout to claim access on our site.</li>
                  <li>Save a copy of the PDF after download for your records.</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="border-top:1px solid #f0e6e4; padding:16px 24px; background:#fff6f5; color:#6b5050; font-size:12px;">
              Need help? Reply to this email or contact support.
            </div>
          </div>
        </div>
      `,
      text: `Your Hausa Wedding Guide is ready.

Download link (valid 24h):
${downloadLink}

Important:
- This link expires in 24 hours.
- We do not resend download links by email.
- Use the same email you used at checkout to claim access on our site.
- Save a copy of the PDF after download.

If the button doesn’t work, copy the link into your browser.
            `,
    });

    if (error) {
      logger.error("Resend error for email:", email, error);
      throw new Error("Failed to send email");
    }

    logger.infoWithEmail("Download email sent successfully to:", email);
    return data;
  } catch (error) {
    logger.error("Email service error for email:", email, error);
    throw error;
  }
}

/**
 * Send web app access email (for interactive guide access)
 */
export async function sendWebAppAccessEmail(email, claimUrl = null) {
  try {
    const webAppLink =
      claimUrl || `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@hausaroom.com",
      to: [email],
      subject: "Your Hausa Wedding Guide – Interactive Access",
      html: `
        <div style="font-family: Inter, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#faf7f6; margin:0; padding:24px;">
          <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.06)">
            <!-- Header -->
            <div style="background: linear-gradient(135deg,#990200,#531946); padding:20px 24px; color:#fff;">
              <div style="font-size:18px; font-weight:700; letter-spacing:.2px;">Hausa Wedding Guide</div>
              <div style="opacity:.9; font-size:13px; margin-top:4px;">Welcome to your interactive planning experience</div>
            </div>
            
            <!-- Body -->
            <div style="padding:24px">
              <h1 style="margin:0 0 8px; font-size:20px; color:#1e1e1e;">Your interactive guide is ready! 🎉</h1>
              <p style="margin:0 0 16px; color:#444; font-size:14px; line-height:1.6">
                Welcome to the Hausa Wedding Guide interactive web app. Plan your perfect wedding with our cloud-synced planning tools.
              </p>

              <div style="background:#f8f4f2; border-left:4px solid #CE805C; padding:16px; margin:20px 0; border-radius:8px;">
                <div style="font-weight:600; color:#1e1e1e; margin-bottom:8px; font-size:14px;">🔑 Your Login Credentials</div>
                <div style="font-size:13px; color:#555; line-height:1.8;">
                  <strong>Email:</strong> ${email}<br>
                  <strong>Password:</strong> <code style="background:#fff; padding:4px 8px; border-radius:4px; color:#990200; font-weight:600;">${SHARED_PASSWORD}</code>
                </div>
              </div>

              <div style="text-align:center; margin:24px 0">
                <a href="${webAppLink}" style="display:inline-block; background:#CE805C; color:#fff; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:600; font-size:15px;">
                  Access Your Interactive Guide
                </a>
              </div>

              <div style="margin-top:24px; padding:16px; background:#f6faf7; border:1px solid #e3efe5; border-radius:12px; color:#234; font-size:13px; line-height:1.7">
                <strong style="display:block; color:#0a5; margin-bottom:8px;">✨ What's Included:</strong>
                <ul style="margin:4px 0; padding-left:20px;">
                  <li>Vision & Values Quiz to discover your wedding style</li>
                  <li>Smart Budget Builder with real-time calculations</li>
                  <li>Vendor Tracker to organize all your contacts</li>
                  <li>Timeline & Task Manager with priority sorting</li>
                  <li>Cloud sync across all your devices</li>
                  <li>Automatic progress saving</li>
                </ul>
              </div>

              <div style="margin-top:20px; padding:14px; background:#fff6f5; border:1px solid #f0e6e4; border-radius:12px; color:#6b5050; font-size:12px; line-height:1.6">
                <strong style="display:block; margin-bottom:4px;">💡 Pro Tips:</strong>
                <ul style="margin:4px 0; padding-left:18px">
                  <li>Your data syncs automatically across devices</li>
                  <li>Use the same email and password to log in from any device</li>
                  <li>All your progress is saved in the cloud</li>
                  <li>You have lifetime access to this guide</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="border-top:1px solid #f0e6e4; padding:16px 24px; background:#fff6f5; color:#6b5050; font-size:12px;">
              Need help? Reply to this email or contact support.
            </div>
          </div>
        </div>
      `,
      text: `Your Hausa Wedding Guide – Interactive Access

Welcome! Your interactive wedding planning guide is ready.

LOGIN CREDENTIALS:
Email: ${email}
Password: ${SHARED_PASSWORD}

Access your guide here:
${webAppLink}

WHAT'S INCLUDED:
- Vision & Values Quiz
- Smart Budget Builder
- Vendor Tracker
- Timeline & Task Manager
- Cloud sync across devices
- Automatic progress saving

PRO TIPS:
- Your data syncs automatically
- Use the same email and password on any device
- All progress is saved in the cloud
- You have lifetime access

Need help? Reply to this email.
      `,
    });

    if (error) {
      logger.error("Resend error for web app email:", email, error);
      throw new Error("Failed to send email");
    }

    logger.infoWithEmail("Web app access email sent successfully to:", email);
    return data;
  } catch (error) {
    logger.error("Web app email service error for email:", email, error);
    throw error;
  }
}

/**
 * Send bundle email (PDF download + web app access)
 */
export async function sendBundleEmail(email, downloadLink, claimUrl = null) {
  try {
    const webAppLink =
      claimUrl || `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@hausaroom.com",
      to: [email],
      subject: "Your Hausa Wedding Guide – Complete Package",
      html: `
        <div style="font-family: Inter, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#faf7f6; margin:0; padding:24px;">
          <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.06)">
            <!-- Header -->
            <div style="background: linear-gradient(135deg,#990200,#531946); padding:20px 24px; color:#fff;">
              <div style="font-size:18px; font-weight:700; letter-spacing:.2px;">Hausa Wedding Guide</div>
              <div style="opacity:.9; font-size:13px; margin-top:4px;">Complete Package – PDF + Interactive Access</div>
            </div>
            
            <!-- Body -->
            <div style="padding:24px">
              <h1 style="margin:0 0 8px; font-size:20px; color:#1e1e1e;">Your complete wedding guide is ready! 🎉</h1>
              <p style="margin:0 0 16px; color:#444; font-size:14px; line-height:1.6">
                You've received the complete package: both the downloadable PDF guide and lifetime access to the interactive web app.
              </p>

              <!-- PDF Download Section -->
              <div style="background:#f8f4f2; padding:18px; margin:20px 0; border-radius:12px; border:2px solid #CE805C;">
                <h2 style="margin:0 0 10px; font-size:16px; color:#1e1e1e;">📄 Download Your PDF Guide</h2>
                <p style="margin:0 0 12px; color:#555; font-size:13px;">
                  Get the complete PDF guide to read offline and print for reference.
                </p>
                <div style="text-align:center">
                  <a href="${downloadLink}" style="display:inline-block; background:#990200; color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:600; font-size:14px;">
                    Download PDF Guide
                  </a>
                </div>
                <p style="margin:12px 0 0; color:#666; font-size:11px; text-align:center;">
                  ⏱️ Link expires in 24 hours – Download now!
                </p>
              </div>

              <!-- Web App Access Section -->
              <div style="background:#f6faf7; padding:18px; margin:20px 0; border-radius:12px; border:2px solid #0a5;">
                <h2 style="margin:0 0 10px; font-size:16px; color:#1e1e1e;">🌐 Access Your Interactive Guide</h2>
                <p style="margin:0 0 12px; color:#555; font-size:13px;">
                  Plan your wedding online with cloud-synced tools and automatic progress saving.
                </p>
                
                <div style="background:#fff; border:1px solid #e3efe5; padding:12px; border-radius:8px; margin:12px 0;">
                  <div style="font-size:12px; color:#666; margin-bottom:6px;">Login Credentials:</div>
                  <div style="font-size:13px; color:#333; line-height:1.7;">
                    <strong>Email:</strong> ${email}<br>
                    <strong>Password:</strong> <code style="background:#f8f4f2; padding:3px 7px; border-radius:4px; color:#990200; font-weight:600;">${SHARED_PASSWORD}</code>
                  </div>
                </div>

                <div style="text-align:center">
                  <a href="${webAppLink}" style="display:inline-block; background:#0a5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:600; font-size:14px;">
                    Open Interactive Guide
                  </a>
                </div>
                <p style="margin:12px 0 0; color:#666; font-size:11px; text-align:center;">
                  ♾️ Lifetime access – Use from any device!
                </p>
              </div>

              <div style="margin-top:20px; padding:14px; background:#fff6f5; border:1px solid #f0e6e4; border-radius:12px; color:#6b5050; font-size:12px; line-height:1.6">
                <strong style="display:block; margin-bottom:6px;">💡 Quick Start Guide:</strong>
                <ol style="margin:4px 0; padding-left:20px">
                  <li>Download the PDF guide now (link expires in 24 hours)</li>
                  <li>Click "Open Interactive Guide" to start planning online</li>
                  <li>Use your email and password to log in from any device</li>
                  <li>All your progress syncs automatically to the cloud</li>
                </ol>
              </div>
            </div>

            <!-- Footer -->
            <div style="border-top:1px solid #f0e6e4; padding:16px 24px; background:#fff6f5; color:#6b5050; font-size:12px;">
              Need help? Reply to this email or contact support.
            </div>
          </div>
        </div>
      `,
      text: `Your Hausa Wedding Guide – Complete Package

You've received the complete package: PDF + Interactive Web App!

═══════════════════════════════════════
📄 DOWNLOAD YOUR PDF GUIDE
═══════════════════════════════════════

Download link (expires in 24 hours):
${downloadLink}

⚠️ Important: Download now – this link expires in 24 hours!

═══════════════════════════════════════
🌐 ACCESS YOUR INTERACTIVE GUIDE
═══════════════════════════════════════

Login Credentials:
Email: ${email}
Password: ${SHARED_PASSWORD}

Access here (lifetime access):
${webAppLink}

QUICK START:
1. Download the PDF guide now (24-hour window)
2. Open the interactive guide online
3. Log in with your email and password
4. Start planning – your progress syncs automatically!

Need help? Reply to this email.
      `,
    });

    if (error) {
      logger.error("Resend error for bundle email:", email, error);
      throw new Error("Failed to send email");
    }

    logger.infoWithEmail("Bundle email sent successfully to:", email);
    return data;
  } catch (error) {
    logger.error("Bundle email service error for email:", email, error);
    throw error;
  }
}
