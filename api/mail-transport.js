// MailerSend helper for sending emails
// Uses MailerSend REST API

export async function sendMailerSendEmail({
  toEmail,
  toName,
  subject,
  text,
  html,
}) {
  const API_KEY = process.env.MAILERSEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@example.com";
  const FROM_NAME = process.env.FROM_NAME || "Hausa Wedding Guide";

  if (!API_KEY) {
    throw new Error("MAILERSEND_API_KEY not set");
  }

  const payload = {
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    to: [
      {
        email: toEmail,
        name: toName || "",
      },
    ],
    subject,
    text,
    html,
  };

  try {
    const res = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("MailerSend error response:", body);
      const err = new Error(`MailerSend error: ${res.status} ${body}`);
      err.status = res.status;
      throw err;
    }

    return res.json();
  } catch (error) {
    console.error("MailerSend API error:", error);
    throw error;
  }
}
