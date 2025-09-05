// Simple test endpoint to verify our setup
import { createClient } from "@supabase/supabase-js";
import { sendDownloadEmail } from "./email.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    console.log("Testing Supabase setup...");

    // Test 1: Database connection
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data, error, count } = await supabase
      .from("sales")
      .select("*", { count: "exact" })
      .limit(1);

    if (error) {
      console.error("Database test failed:", error);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
        error: error.message,
        hint: "Make sure you ran the SQL setup script in Supabase",
      });
    }

    console.log("Database test: SUCCESS");

    // Test 2: Storage bucket access
    const { data: bucketData, error: bucketError } = await supabase.storage
      .from("private")
      .list();

    if (bucketError) {
      console.error("Storage test failed:", bucketError);
      return res.status(500).json({
        status: "error",
        message: "Storage bucket access failed",
        error: bucketError.message,
        hint: "Make sure the 'private' bucket exists and has proper policies",
      });
    }

    console.log("Storage test: SUCCESS");

    // Test 3: Email configuration (don't actually send)
    const hasResendKey = !!process.env.RESEND_API_KEY;

    console.log(
      "Email test: RESEND_API_KEY is",
      hasResendKey ? "configured" : "missing"
    );

    return res.status(200).json({
      status: "success",
      message: "All tests passed!",
      tests: {
        database: {
          status: "✅ Connected",
          salesTableExists: true,
          totalSales: count,
        },
        storage: {
          status: "✅ Connected",
          privateBucketExists: true,
          files: bucketData?.length || 0,
        },
        email: {
          status: hasResendKey ? "✅ Configured" : "❌ Missing API Key",
          hasResendKey,
        },
      },
      nextSteps: hasResendKey
        ? [
            "Your setup is complete!",
            "Try making a test payment to verify the full flow",
          ]
        : [
            "Add RESEND_API_KEY to your Vercel environment variables",
            "Then try making a test payment",
          ],
    });
  } catch (err) {
    console.error("Setup test error:", err);
    return res.status(500).json({
      status: "error",
      message: "Setup test failed",
      error: err.message,
    });
  }
}
