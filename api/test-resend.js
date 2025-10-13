import { Resend } from "resend";

export default async function handler(req, res) {
  // Allow both GET and POST for easy testing
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log("[TEST-RESEND] Attempting to send test email...");
    console.log("[TEST-RESEND] API Key exists:", !!process.env.RESEND_API_KEY);
    console.log(
      "[TEST-RESEND] API Key starts with:",
      process.env.RESEND_API_KEY?.substring(0, 8)
    );

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "k.kabir@devwithdijah.com",
      subject: "🧪 Resend Test - Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p><p>If you received this, Resend is working correctly! ✅</p>",
    });

    if (error) {
      console.error("[TEST-RESEND] Resend error:", error);
      return res.status(400).json({
        success: false,
        error: error.message,
        errorDetails: error,
      });
    }

    console.log("[TEST-RESEND] Email sent successfully:", data);
    return res.status(200).json({
      success: true,
      messageId: data.id,
      message:
        "Test email sent! Check k.kabir@devwithdijah.com inbox (and spam folder).",
      data: data,
    });
  } catch (err) {
    console.error("[TEST-RESEND] Exception:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }
}
