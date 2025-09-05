// Clean email helper using Resend API directly
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "k.kabir@devwithdijah.com";
const FROM_NAME = "Hausa Wedding Guide";

export async function sendDownloadEmail({ email, password, downloadUrl }) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const emailData = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [email],
    subject: "Your Hausa Wedding Guide Download",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #b45309; text-align: center; margin-bottom: 30px;">
            🎉 Thank you for your purchase!
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your Hausa Wedding Guide is ready for download. Use the details below to access your file:
          </p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">Download Password:</p>
            <p style="font-size: 24px; font-weight: bold; color: #b45309; margin: 10px 0; font-family: monospace; letter-spacing: 2px;">
              ${password}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" style="background: #b45309; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
              📥 Download Your Guide
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
            <p><strong>Important Notes:</strong></p>
            <ul style="line-height: 1.6;">
              <li>This download link expires in 5 minutes for security</li>
              <li>You can download the file up to 3 times</li>
              <li>Keep your password safe - you'll need it to access the file</li>
              <li>If you have any issues, reply to this email for support</li>
            </ul>
          </div>
          
          <p style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
            Happy planning! 💒<br>
            The Hausa Wedding Guide Team
          </p>
        </div>
      </div>
    `,
    text: `
Thank you for your purchase!

Your Hausa Wedding Guide is ready for download.

Download Password: ${password}
Download Link: ${downloadUrl}

Important: This link expires in 5 minutes and you can download up to 3 times.
Keep your password safe!

Happy planning!
The Hausa Wedding Guide Team
    `,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Resend API error:", error);
    throw new Error(`Failed to send email: ${response.status} ${error}`);
  }

  const result = await response.json();
  console.log("Email sent successfully:", result.id);
  return result;
}
