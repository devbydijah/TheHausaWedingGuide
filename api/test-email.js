// Test Resend functionality independently
// POST /api/test-email

import { sendEmail } from "./mail-transport.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "email required" });
  }

  try {
    console.log("Testing Resend with email:", email);

    await sendEmail({
      toEmail: email,
      subject: "Resend Test",
      html: "<h2>Test Email</h2><p>If you receive this, Resend is working!</p>",
      text: "Test Email - If you receive this, Resend is working!",
    });

    console.log("Resend test successful");
    return res
      .status(200)
      .json({ ok: true, message: "Test email sent successfully" });
  } catch (error) {
    console.error("Resend test failed:", error);
    return res.status(500).json({
      error: "Resend failed",
      details: error.message,
      status: error.status,
    });
  }
}
