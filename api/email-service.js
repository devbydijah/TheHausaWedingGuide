// Simple Resend email function
export async function sendDownloadEmail(toEmail, password, downloadUrl) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = "k.kabir@devwithdijah.com";

  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const emailData = {
    from: `Hausa Wedding Guide <${FROM_EMAIL}>`,
    to: [toEmail],
    subject: "Your Hausa Wedding Guide - Download Instructions",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #b45309;">Thank you for your purchase!</h2>
        <p>Your payment has been confirmed. Here are your download details:</p>
        
        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Download Password:</h3>
          <p style="font-size: 18px; font-weight: bold; color: #059669; letter-spacing: 1px;">${password}</p>
          <p><a href="${downloadUrl}" style="background: #b45309; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Download Your Guide</a></p>
        </div>
        
        <p><strong>Important:</strong></p>
        <ul>
          <li>This download link expires in 5 minutes</li>
          <li>You can download up to 3 times with this password</li>
          <li>Keep your password safe for future downloads</li>
        </ul>
        
        <p>If you have any issues, please contact us at ${FROM_EMAIL}</p>
        
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This email was sent because you purchased the Hausa Wedding Guide.
        </p>
      </div>
    `,
    text: `
Thank you for purchasing the Hausa Wedding Guide!

Your download password: ${password}
Download link: ${downloadUrl}

Important:
- Link expires in 5 minutes
- You can download up to 3 times
- Keep your password for future downloads

If you need help, contact us at ${FROM_EMAIL}
    `,
  };

  console.log("Sending email via Resend API...");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Resend API error:", response.status, errorText);
    throw new Error(`Email send failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log("Email sent successfully:", result.id);
  return result;
}
