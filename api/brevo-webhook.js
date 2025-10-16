// /api/brevo-webhook.js
// Brevo webhook endpoint for Vercel/Node.js (logs all events)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;
    // Log the event to the console (or replace with DB/Supabase logging)
    console.log("[BREVO WEBHOOK]", JSON.stringify(event, null, 2));
    // Respond quickly to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("[BREVO WEBHOOK] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// If using Vercel, this file should be placed in /api/brevo-webhook.js
// For Supabase or other DB logging, insert your logic where the console.log is.
