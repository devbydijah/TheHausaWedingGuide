// Simple email service using Resend - Rebuilt from scratch// Simple email service using Resend

import { Resend } from 'resend';import { Resend } from "resend";

import { logger } from "./logger.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

const FROM_NAME = process.env.FROM_NAME || 'Hausa Wedding Guide';const WEB_APP_URL =

const FROM_ADDRESS = `${FROM_NAME} <${FROM_EMAIL}>`;  process.env.WEB_APP_URL || process.env.VERCEL_URL

    ? `https://${process.env.VERCEL_URL}`

const WEB_APP_URL = 'https://the-hausa-weding-guide-interactive.vercel.app';    : "http://localhost:5173";

const PDF_BASE_URL = 'https://the-hausa-weding-guide.vercel.app';

// Email sender configuration

/**const FROM_NAME = process.env.FROM_NAME || "Hausa Wedding Guide";

 * Send PDF download emailconst FROM_EMAIL = process.env.FROM_EMAIL || "noreply@hausaroom.com";

 */const FROM_ADDRESS = `${FROM_NAME} <${FROM_EMAIL}>`;

export async function sendDownloadEmail(email, downloadLink) {

  console.log(`[EMAIL] Attempting to send PDF download email to: ${email}`);/**

  console.log(`[EMAIL] FROM_ADDRESS: ${FROM_ADDRESS}`); * Send PDF download email (existing functionality)

  console.log(`[EMAIL] API Key exists: ${!!process.env.RESEND_API_KEY}`); */

export async function sendDownloadEmail(email, downloadLink) {

  try {  try {

    const { data, error } = await resend.emails.send({    const { data, error } = await resend.emails.send({

      from: FROM_ADDRESS,      from: FROM_ADDRESS,

      to: [email],      to: [email],

      subject: 'Your Hausa Wedding Guide – Download Link',      subject: "Your Hausa Wedding Guide – Download Link",

      html: `      html: `

        <h1>Your PDF Guide is Ready!</h1>        <div style="font-family: Inter, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#faf7f6; margin:0; padding:24px;">

        <p>Thank you for your purchase. Click the button below to download your guide:</p>          <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.06)">

        <p><a href="${downloadLink}" style="display:inline-block; background:#CE805C; color:#fff; padding:12px 24px; text-decoration:none; border-radius:8px;">Download Your Guide</a></p>            <!-- Header -->

        <p>Or copy this link: <br><a href="${downloadLink}">${downloadLink}</a></p>            <div style="background: linear-gradient(135deg,#990200,#531946); padding:20px 24px; color:#fff;">

        <p><strong>Important:</strong> This link expires in 24 hours.</p>              <div style="font-size:18px; font-weight:700; letter-spacing:.2px;">Hausa Wedding Guide</div>

      `,              <div style="opacity:.9; font-size:13px; margin-top:4px;">Your purchase is confirmed</div>

      text: `Your Hausa Wedding Guide is ready!\n\nDownload link: ${downloadLink}\n\nThis link expires in 24 hours.`            </div>

    });            

            <!-- Body -->

    if (error) {            <div style="padding:24px">

      console.error('[EMAIL] Resend error:', error);              <h1 style="margin:0 0 8px; font-size:20px; color:#1e1e1e;">Your guide is ready</h1>

      throw new Error(`Resend error: ${error.message}`);              <p style="margin:0 0 16px; color:#444; font-size:14px; line-height:1.6">

    }                Click the button below to download your Hausa Wedding Guide. This link is secure and temporary.

              </p>

    console.log('[EMAIL] ✅ PDF email sent successfully. Message ID:', data.id);

    return data;              <div style="text-align:center; margin:20px 0 8px">

  } catch (err) {                <a href="${downloadLink}" style="display:inline-block; background:#CE805C; color:#fff; text-decoration:none; padding:12px 20px; border-radius:10px; font-weight:600; font-size:15px;">

    console.error('[EMAIL] ❌ Exception sending PDF email:', err);                  Download Your Guide

    throw err;                </a>

  }              </div>

}              <p style="margin:8px 0 0; color:#666; font-size:12px; text-align:center; word-break:break-all;">If the button doesn’t work, copy and paste this link in your browser:<br>

                <span style="color:#990200">${downloadLink}</span>

/**              </p>

 * Send Web App access email

 */              <div style="margin-top:20px; padding:12px 14px; background:#f6faf7; border:1px solid #e3efe5; border-radius:12px; color:#234; font-size:12px; line-height:1.6">

export async function sendWebAppAccessEmail(email, txRef) {                <strong style="display:block; color:#0a5; margin-bottom:4px">Important</strong>

  console.log(`[EMAIL] Attempting to send Web App access email to: ${email}`);                <ul style="margin:0; padding-left:16px">

  console.log(`[EMAIL] FROM_ADDRESS: ${FROM_ADDRESS}`);                  <li>This link expires in 24 hours.</li>

  console.log(`[EMAIL] API Key exists: ${!!process.env.RESEND_API_KEY}`);                  <li>We do not resend download links by email.</li>

                  <li>Please use the same email you used at checkout to claim access on our site.</li>

  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;                  <li>Save a copy of the PDF after download for your records.</li>

                </ul>

  try {              </div>

    const { data, error } = await resend.emails.send({            </div>

      from: FROM_ADDRESS,

      to: [email],            <!-- Footer -->

      subject: 'Welcome to Your Interactive Wedding Guide! 🎉',            <div style="border-top:1px solid #f0e6e4; padding:16px 24px; background:#fff6f5; color:#6b5050; font-size:12px;">

      html: `              Need help? Reply to this email or contact support.

        <h1>Welcome to Your Interactive Wedding Guide! 🎉</h1>            </div>

        <p>Thank you for purchasing <strong>The Hausa Wedding Guide Interactive Planner</strong>!</p>          </div>

                </div>

        <h2>Get Started in 3 Easy Steps:</h2>      `,

        <ol>      text: `Your Hausa Wedding Guide is ready.

          <li>Click the button below to access your planner</li>

          <li>Create your account using this email: <strong>${email}</strong></li>Download link (valid 24h):

          <li>Start planning your dream wedding!</li>${downloadLink}

        </ol>

Important:

        <p style="text-align:center; margin:30px 0;">- This link expires in 24 hours.

          <a href="${signupUrl}" style="display:inline-block; background:#CE805C; color:#fff; padding:14px 28px; text-decoration:none; border-radius:10px; font-size:16px; font-weight:600;">- We do not resend download links by email.

            Create Your Account & Start Planning- Use the same email you used at checkout to claim access on our site.

          </a>- Save a copy of the PDF after download.

        </p>

If the button doesn’t work, copy the link into your browser.

        <p><strong>⏰ Access Duration:</strong> You have 20 days from your first login to use the interactive planner.</p>            `,

    });

        <p><strong>✨ What's Included:</strong></p>

        <ul>    if (error) {

          <li>Vision & Values Quiz</li>      logger.error("Resend error for email:", email, error);

          <li>Smart Budget Builder</li>      throw new Error("Failed to send email");

          <li>Vendor Tracker</li>    }

          <li>Timeline & Task Manager</li>

          <li>Cloud sync across devices</li>    logger.infoWithEmail("Download email sent successfully to:", email);

          <li>Export personalized PDF</li>    return data;

        </ul>  } catch (error) {

    logger.error("Email service error for email:", email, error);

        <p>Need help? Reply to this email!</p>    throw error;

        <p>Happy planning! 💐</p>  }

}

        <hr>

        <p style="font-size:12px; color:#666;">Transaction Reference: ${txRef}</p>/**

      `, * Send web app access email (for interactive guide access)

      text: `Welcome to Your Interactive Wedding Guide! * NEW: No temporary password - users create their own account during signup

 * @param {string} email - Customer email address

Thank you for purchasing The Hausa Wedding Guide Interactive Planner! * @param {string} txRef - Paystack transaction reference

 */

GET STARTED:export async function sendWebAppAccessEmail(email, txRef) {

1. Visit: ${signupUrl}  try {

2. Create your account using this email: ${email}    const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;

3. Start planning your dream wedding!

    const { data, error } = await resend.emails.send({

⏰ ACCESS: You have 20 days from your first login.      from: FROM_ADDRESS,

      to: [email],

✨ INCLUDES: Vision Quiz, Budget Builder, Vendor Tracker, Timeline Manager, Cloud Sync, PDF Export      subject: "Welcome to Your Interactive Wedding Guide! 🎉",

      html: `

Need help? Reply to this email!        <div style="font-family: Inter, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#faf7f6; margin:0; padding:24px;">

          <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.06)">

Transaction Reference: ${txRef}`            <!-- Header -->

    });            <div style="background: linear-gradient(135deg,#990200,#531946); padding:20px 24px; color:#fff;">

              <div style="font-size:18px; font-weight:700; letter-spacing:.2px;">Hausa Wedding Guide</div>

    if (error) {              <div style="opacity:.9; font-size:13px; margin-top:4px;">Welcome to your interactive planning experience</div>

      console.error('[EMAIL] Resend error:', error);            </div>

      throw new Error(`Resend error: ${error.message}`);            

    }            <!-- Body -->

            <div style="padding:24px">

    console.log('[EMAIL] ✅ Web App email sent successfully. Message ID:', data.id);              <h1 style="margin:0 0 8px; font-size:20px; color:#1e1e1e;">Your interactive guide is ready! 🎉</h1>

    return data;              <p style="margin:0 0 16px; color:#444; font-size:14px; line-height:1.6">

  } catch (err) {                Thank you for purchasing <strong>The Hausa Wedding Guide Interactive Planner</strong>! Your payment has been confirmed.

    console.error('[EMAIL] ❌ Exception sending Web App email:', err);              </p>

    throw err;

  }              <div style="background:#f8f4f2; border-left:4px solid #CE805C; padding:16px; margin:20px 0; border-radius:8px;">

}                <div style="font-weight:600; color:#1e1e1e; margin-bottom:8px; font-size:14px;">📝 How to Get Started:</div>

                <ol style="margin:0; padding-left:20px; font-size:13px; color:#555; line-height:1.8;">

/**                  <li><strong>Click the button below</strong> to access your planner</li>

 * Send bundle email (both products)                  <li><strong>Create your account</strong> using this email: <code style="background:#fff; padding:2px 6px; border-radius:3px; color:#990200;">${email}</code></li>

 */                  <li><strong>Choose a secure password</strong> (at least 8 characters)</li>

export async function sendBundleEmail(email, downloadLink, txRef, hasExistingAccount = false) {                  <li><strong>Complete your profile</strong> with your name and wedding date</li>

  console.log(`[EMAIL] Attempting to send Bundle email to: ${email}`);                  <li><strong>Start planning!</strong> Your data syncs automatically across devices</li>

  console.log(`[EMAIL] FROM_ADDRESS: ${FROM_ADDRESS}`);                </ol>

  console.log(`[EMAIL] API Key exists: ${!!process.env.RESEND_API_KEY}`);              </div>



  const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;              <div style="text-align:center; margin:24px 0">

                <a href="${signupUrl}" style="display:inline-block; background:#CE805C; color:#fff; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:600; font-size:15px;">

  try {                  Create Your Account & Start Planning

    const { data, error } = await resend.emails.send({                </a>

      from: FROM_ADDRESS,              </div>

      to: [email],

      subject: 'Your Complete Hausa Wedding Guide Package! 🎁',              <div style="background:#fff3cd; border:1px solid #ffc107; padding:16px; margin:20px 0; border-radius:12px;">

      html: `                <div style="font-weight:600; color:#856404; margin-bottom:8px; font-size:14px;">⏰ Access Duration</div>

        <h1>Your Complete Wedding Guide Package! 🎁</h1>                <div style="font-size:13px; color:#856404; line-height:1.7;">

        <p>Congratulations! You now have access to <strong>both</strong> the PDF Guide and Interactive Planner!</p>                  You have <strong>20 days</strong> from your first login to use the interactive planner. Make the most of your planning time!

                </div>

        <h2>📥 Download Your PDF Guide</h2>              </div>

        <p><a href="${downloadLink}" style="display:inline-block; background:#CE805C; color:#fff; padding:12px 24px; text-decoration:none; border-radius:8px;">Download PDF Guide</a></p>

        <p>Link expires in 24 hours.</p>              <div style="margin-top:24px; padding:16px; background:#f6faf7; border:1px solid #e3efe5; border-radius:12px; color:#234; font-size:13px; line-height:1.7">

                <strong style="display:block; color:#0a5; margin-bottom:8px;">✨ What's Included:</strong>

        <h2>🌐 Access Your Interactive Planner</h2>                <ul style="margin:4px 0; padding-left:20px;">

        ${hasExistingAccount                   <li>Vision & Values Quiz to discover your wedding style</li>

          ? `<p>Sign in to your existing account at: <a href="${WEB_APP_URL}">${WEB_APP_URL}</a></p>`                  <li>Smart Budget Builder with real-time calculations</li>

          : `<p><a href="${signupUrl}" style="display:inline-block; background:#740015; color:#fff; padding:12px 24px; text-decoration:none; border-radius:8px; margin-top:10px;">Create Your Account</a></p>`                  <li>Vendor Tracker to organize all your contacts</li>

        }                  <li>Timeline & Task Manager with priority sorting</li>

                  <li>Cloud sync across all your devices</li>

        <p>Need help? Reply to this email!</p>                  <li>Export personalized PDF of your complete plan</li>

        <p>Happy planning! 💐</p>                </ul>

              </div>

        <hr>

        <p style="font-size:12px; color:#666;">Transaction Reference: ${txRef}</p>              <div style="margin-top:20px; font-size:12px; color:#666; line-height:1.6;">

      `,                <strong>Need help?</strong> Reply to this email and we'll assist you promptly.

      text: `Your Complete Wedding Guide Package!              </div>



You now have access to BOTH the PDF Guide and Interactive Planner!              <p style="margin-top:16px; color:#555; font-size:14px;">Happy planning! 💐</p>

            </div>

📥 DOWNLOAD PDF:

${downloadLink}            <!-- Footer -->

(Expires in 24 hours)            <div style="border-top:1px solid #f0e6e4; padding:16px 24px; background:#fff6f5; color:#6b5050; font-size:12px;">

              <div>© 2024 Hausa Wedding Guide. All rights reserved.</div>

🌐 INTERACTIVE PLANNER:              <div style="margin-top:4px;">Transaction Reference: ${txRef}</div>

${hasExistingAccount ? `Sign in at: ${WEB_APP_URL}` : `Create account: ${signupUrl}`}            </div>

          </div>

Need help? Reply to this email!        </div>

      `,

Transaction Reference: ${txRef}`      text: `Welcome to Your Interactive Wedding Guide!

    });

Thank you for purchasing The Hausa Wedding Guide Interactive Planner! Your payment has been confirmed.

    if (error) {

      console.error('[EMAIL] Resend error:', error);HOW TO GET STARTED:

      throw new Error(`Resend error: ${error.message}`);1. Click this link: ${signupUrl}

    }2. Create your account using this email: ${email}

3. Choose a secure password (at least 8 characters)

    console.log('[EMAIL] ✅ Bundle email sent successfully. Message ID:', data.id);4. Complete your profile with your name and wedding date

    return data;5. Start planning! Your data syncs automatically across devices

  } catch (err) {

    console.error('[EMAIL] ❌ Exception sending Bundle email:', err);⏰ ACCESS DURATION:

    throw err;You have 20 days from your first login to use the interactive planner.

  }

}✨ WHAT'S INCLUDED:

- Vision & Values Quiz
- Smart Budget Builder
- Vendor Tracker
- Timeline & Task Manager
- Cloud sync across devices
- Export personalized PDF

Need help? Reply to this email.

Happy planning! 💐

Transaction Reference: ${txRef}
      `,
    });

    if (error) {
      logger.error("Resend error for web app email:", email, error);
      throw new Error("Failed to send email");
    }

    logger.infoWithEmail("Web app signup email sent successfully to:", email);
    return data;
  } catch (error) {
    logger.error("Web app email service error for email:", email, error);
    throw error;
  }
}

/**
 * Send bundle email (PDF download + web app access)
 * NEW: No temporary password - users create their own account during signup
 * @param {string} email - Customer email address
 * @param {string} downloadLink - PDF download URL
 * @param {string} txRef - Paystack transaction reference
 * @param {boolean} hasAccount - Whether user already has an account
 */
export async function sendBundleEmail(
  email,
  downloadLink,
  txRef,
  hasAccount = false
) {
  try {
    const signupUrl = `${WEB_APP_URL}/?guide=1&email=${encodeURIComponent(email)}`;

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Your Complete Wedding Planning Bundle 🎉",
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
              <h1 style="margin:0 0 8px; font-size:20px; color:#1e1e1e;">Your complete wedding bundle is ready! 🎉</h1>
              <p style="margin:0 0 16px; color:#444; font-size:14px; line-height:1.6">
                Thank you for purchasing the <strong>Complete Wedding Planning Bundle</strong>! You now have access to both the PDF guide and interactive planner.
              </p>

              <!-- PDF Download Section -->
              <div style="background:#f8f4f2; padding:18px; margin:20px 0; border-radius:12px; border:2px solid #CE805C;">
                <h2 style="margin:0 0 10px; font-size:16px; color:#1e1e1e;">📄 Step 1: Download Your PDF Guide</h2>
                <p style="margin:0 0 12px; color:#555; font-size:13px;">
                  Get your comprehensive wedding planning PDF guide:
                </p>
                <div style="text-align:center">
                  <a href="${downloadLink}" style="display:inline-block; background:#990200; color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:600; font-size:14px;">
                    Download PDF Guide
                  </a>
                </div>
                <p style="margin:12px 0 0; color:#666; font-size:11px; text-align:center;">
                  ⏱️ This link expires in 24 hours. Download count: 0/3
                </p>
              </div>

              <!-- Web App Access Section -->
              <div style="background:#f6faf7; padding:18px; margin:20px 0; border-radius:12px; border:2px solid #0a5;">
                <h2 style="margin:0 0 10px; font-size:16px; color:#1e1e1e;">🌐 Step 2: Access Your Interactive Planner</h2>
                <p style="margin:0 0 12px; color:#555; font-size:13px;">
                  <strong>How to Get Started:</strong>
                </p>
                <ol style="margin:0 0 12px; padding-left:20px; font-size:12px; color:#555; line-height:1.7;">
                  <li>Click the button below to access your planner</li>
                  <li>Create your account using this email: <code style="background:#fff; padding:2px 6px; border-radius:3px; color:#990200;">${email}</code></li>
                  <li>Set your own password</li>
                  <li>Complete your profile (bride name & wedding date)</li>
                  <li>Start planning with cloud sync!</li>
                </ol>

                <div style="text-align:center; margin:12px 0">
                  <a href="${signupUrl}" style="display:inline-block; background:#0a5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:600; font-size:14px;">
                    Create Account & Access Planner
                  </a>
                </div>

                <div style="background:#fff3cd; padding:10px; border-radius:6px; margin-top:12px;">
                  <p style="margin:0; font-size:11px; color:#856404;">
                    ⏰ <strong>Interactive Planner Access:</strong> 20 days from your first login
                  </p>
                </div>
              </div>

              <div style="margin-top:20px; padding:14px; background:#fff6f5; border:1px solid #f0e6e4; border-radius:12px; color:#6b5050; font-size:12px; line-height:1.6">
                <strong style="display:block; margin-bottom:6px;">💡 What You'll Get:</strong>
                <ul style="margin:4px 0; padding-left:20px">
                  <li>Complete PDF guide for offline reference</li>
                  <li>Vision & Values Quiz</li>
                  <li>Smart Budget Builder</li>
                  <li>Vendor Tracker</li>
                  <li>Timeline & Task Manager</li>
                  <li>Cloud sync across all devices</li>
                  <li>Export personalized wedding plan</li>
                </ul>
              </div>

              <div style="margin-top:16px; font-size:12px; color:#666; line-height:1.6;">
                <strong>Need help?</strong> Reply to this email and we'll assist you promptly.
              </div>

              <p style="margin-top:16px; color:#555; font-size:14px;">Happy planning! 💐</p>
            </div>

            <!-- Footer -->
            <div style="border-top:1px solid #f0e6e4; padding:16px 24px; background:#fff6f5; color:#6b5050; font-size:12px;">
              <div>© 2024 Hausa Wedding Guide. All rights reserved.</div>
              <div style="margin-top:4px;">Transaction Reference: ${txRef}</div>
            </div>
          </div>
        </div>
      `,
      text: `Your Complete Wedding Planning Bundle is Ready!

Thank you for purchasing the Complete Wedding Planning Bundle! You now have access to both the PDF guide and interactive planner.

═══════════════════════════════════════
📄 STEP 1: DOWNLOAD YOUR PDF GUIDE
═══════════════════════════════════════

Download link: ${downloadLink}
(Expires in 24 hours. Downloads: 0/3)

═══════════════════════════════════════
🌐 STEP 2: ACCESS YOUR INTERACTIVE PLANNER
═══════════════════════════════════════

HOW TO GET STARTED:
1. Click this link: ${signupUrl}
2. Create your account using this email: ${email}
3. Set your own password
4. Complete your profile (bride name & wedding date)
5. Start planning with cloud sync!

⏰ Interactive Planner Access: 20 days from your first login

WHAT YOU'LL GET:
- Complete PDF guide for offline reference
- Vision & Values Quiz
- Smart Budget Builder
- Vendor Tracker
- Timeline & Task Manager
- Cloud sync across all devices
- Export personalized wedding plan

Need help? Reply to this email.

Happy planning! 💐

Transaction Reference: ${txRef}
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
