// Simple email service using Resend
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      console.error("Resend error:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}
