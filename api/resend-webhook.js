
// api/resend-webhook.js

import { createClient } from "@supabase/supabase-js";

// Safety check to ensure environment variables are loaded
if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("[Resend Webhook] FATAL: Supabase environment variables are not set.");
}

// Initialize Supabase client using the correct, consistent variable names
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;
    const eventType = event.type;
    
    console.log(`[Resend Webhook] Received event: ${eventType}`);

    // A set of email event types we want to log
    const allowedEvents = new Set([
      "email.sent",
      "email.delivered",
      "email.bounced",
      "email.failed",
      "email.opened",
      "email.clicked",
      "email.delivery_delayed",
      "email.complained",
    ]);

    if (!allowedEvents.has(eventType)) {
      console.log(`[Resend Webhook] Ignored non-email event: ${eventType}`);
      return res.status(200).json({ message: "Event ignored" });
    }

    // Prepare the data to be inserted into your Supabase table
    const logEntry = {
      event_type: eventType,
      resend_id: event.data?.id || null,
      recipient: event.data?.to?.[0] || null, // Resend `to` field is an array of strings
      payload: event, // Store the full event payload for auditing
    };

    // Insert the log entry into the 'email_event_logs' table
    const { error } = await supabase.from("email_event_logs").insert([logEntry]);

    if (error) {
      console.error("[Resend Webhook] ❌ Failed to log event to Supabase:", error.message);
      return res.status(500).json({ error: "Failed to log event to database" });
    }

    console.log(`[Resend Webhook] ✅ Successfully logged event: ${eventType}`);
    res.status(200).json({ message: "Event logged successfully" });

  } catch (err) {
    console.error("[Resend Webhook] ❌ An unexpected error occurred:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}