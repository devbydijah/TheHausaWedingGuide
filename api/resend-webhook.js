// API endpoint to receive Resend webhooks and log email events to Supabase
// Place this file at: api/resend-webhook.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Resend sends JSON payloads
  const event = req.body;
  const eventType = event.type;
  const resendId = event.data?.id || null;
  const recipient = event.data?.to || event.data?.recipient || null;

  // Only log email events
  const allowedEvents = [
    "email.sent",
    "email.delivered",
    "email.bounced",
    "email.failed",
    "email.opened",
    "email.clicked",
    "email.delivery_delayed",
    "email.complained",
  ];
  if (!allowedEvents.includes(eventType)) {
    return res.status(200).json({ message: "Event ignored" });
  }

  // Insert into Supabase
  const { error } = await supabase.from("email_event_logs").insert([
    {
      event_type: eventType,
      resend_id: resendId,
      recipient,
      payload: event,
    },
  ]);

  if (error) {
    console.error("[Resend Webhook] Failed to log event:", error);
    return res.status(500).json({ error: "Failed to log event" });
  }

  res.status(200).json({ message: "Event logged" });
}
