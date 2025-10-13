// Test endpoint to verify Resend email works
import { Resend } from "resend";

export default async function handler(req, res) {
  console.log("[TEST-EMAIL] 🧪 Starting Resend test...");
  console.log(
    "[TEST-EMAIL] 🔑 RESEND_API_KEY exists:",
    !!process.env.RESEND_API_KEY
  );
  console.log(
    "[TEST-EMAIL] 🔑 API Key (first 10 chars):",
    process.env.RESEND_API_KEY?.substring(0, 10)
  );
  console.log("[TEST-EMAIL] 📮 FROM_EMAIL:", process.env.FROM_EMAIL);

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      error: "RESEND_API_KEY not configured",
      env: Object.keys(process.env).filter((k) => k.includes("RESEND")),
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const testEmail = req.query.email || "k.kabir@devwithdijah.com";

  try {
    console.log("[TEST-EMAIL] 📧 Sending test email to:", testEmail);

    const { data, error } = await resend.emails.send({
      from: "Hausa Room <onboarding@resend.dev>",
      to: testEmail,
      subject: "🧪 Resend Test - Hausa Wedding Guide",
      html: `
        <h1 style="color: #740015;">✅ Resend is Working!</h1>
        <p>If you received this email, your Resend configuration is correct.</p>
        <hr>
        <p><strong>Details:</strong></p>
        <ul>
          <li>Time: ${new Date().toISOString()}</li>
          <li>From: Hausa Room &lt;onboarding@resend.dev&gt;</li>
          <li>To: ${testEmail}</li>
        </ul>
        <p style="color: #666; font-size: 12px;">This is an automated test email.</p>
      `,
      text: `✅ Resend is Working!\n\nIf you received this email, your Resend configuration is correct.\n\nTime: ${new Date().toISOString()}\nFrom: onboarding@resend.dev\nTo: ${testEmail}`,
    });

    if (error) {
      console.error("[TEST-EMAIL] ❌ Resend error:", error);
      return res.status(400).json({
        success: false,
        error: error.message,
        errorDetails: error,
        config: {
          apiKeyExists: !!process.env.RESEND_API_KEY,
          fromEmail: process.env.FROM_EMAIL,
        },
      });
    }

    console.log("[TEST-EMAIL] ✅ Email sent successfully!");
    console.log("[TEST-EMAIL] 📬 Message ID:", data.id);

    return res.status(200).json({
      success: true,
      messageId: data.id,
      message: `Test email sent to ${testEmail}! Check your inbox (and spam folder).`,
      sentTo: testEmail,
      sentAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[TEST-EMAIL] ❌ Exception:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }
}
