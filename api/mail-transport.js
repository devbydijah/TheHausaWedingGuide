// Resend helper for sending emails
// Uses Resend REST API

export async function sendEmail({ toEmail, toName, subject, text, html }) {
  const API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || "k.kabir@devwithdijah.com";
  const FROM_NAME = process.env.FROM_NAME || "HAUSA ROOM";

  if (!API_KEY) {
    throw new Error("RESEND_API_KEY not set");
  }

  const payload = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [toEmail],
    subject,
    text,
    html,
  };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error response:", body);
      const err = new Error(`Resend error: ${res.status} ${body}`);
      err.status = res.status;
      throw err;
    }

    return res.json();
  } catch (error) {
    console.error("Resend API error:", error);
    throw error;
  }
}
