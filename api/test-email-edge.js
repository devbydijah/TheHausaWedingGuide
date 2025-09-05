// Simple test to verify Edge Function email sending
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    console.log("Testing Edge Function email with:", { email });

    // Test the Edge Function
    const { data: emailResponse, error: emailError } =
      await supabase.functions.invoke("resend-email", {
        body: {
          to: email,
          password: "TEST123",
          downloadUrl: "https://example.com/test",
        },
      });

    console.log("Edge Function response:", { emailResponse, emailError });

    if (emailError) {
      return res.status(500).json({
        error: "Edge Function failed",
        details: emailError.message,
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Test email sent successfully",
      response: emailResponse,
    });
  } catch (err) {
    console.error("Test email error:", err);
    return res.status(500).json({
      error: "Test failed",
      details: err.message,
    });
  }
}
