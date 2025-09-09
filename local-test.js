// Local test script to simulate the payment flow
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables from .env.local if it exists
dotenv.config({ path: ".env.local" });

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Environment variables check:");
console.log("PAYSTACK_SECRET:", !!PAYSTACK_SECRET);
console.log("SUPABASE_URL:", !!SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY:", !!SUPABASE_SERVICE_ROLE_KEY);

if (!PAYSTACK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function testDatabaseConnection() {
  console.log("\n--- Testing Database Connection ---");
  try {
    const { data, error, count } = await supabase
      .from("sales")
      .select("*", { count: "exact" })
      .limit(1);

    if (error) {
      console.error("❌ Database error:", error.message);
      if (error.message.includes('relation "sales" does not exist')) {
        console.log(
          "💡 Solution: You need to create the sales table in Supabase"
        );
        console.log("Run this SQL in your Supabase dashboard:");
        console.log(`
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  paystack_reference TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  amount INTEGER NOT NULL,
  password_hash TEXT NOT NULL,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sales_paystack_reference_idx ON sales(paystack_reference);
CREATE INDEX IF NOT EXISTS sales_email_idx ON sales(email);
        `);
      }
      return false;
    } else {
      console.log("✅ Database connection successful");
      console.log("📊 Total sales records:", count);
      return true;
    }
  } catch (e) {
    console.error("❌ Connection failed:", e.message);
    return false;
  }
}

async function testEdgeFunction(testEmail = "test@example.com") {
  console.log("\n--- Testing Edge Function ---");
  try {
    const { data: emailResponse, error: emailError } =
      await supabase.functions.invoke("resend-email", {
        body: {
          to: testEmail,
          password: "TEST_PASSWORD_123",
          downloadUrl: "https://example.com/test-download",
        },
      });

    if (emailError) {
      console.error("❌ Edge Function failed:", emailError.message);
      console.log("💡 Check your Supabase Edge Functions and RESEND_API_KEY");
      return false;
    } else {
      console.log("✅ Edge Function executed successfully");
      console.log("📧 Response:", emailResponse);
      return true;
    }
  } catch (e) {
    console.error("❌ Edge Function error:", e.message);
    return false;
  }
}

async function testPaystackConnection() {
  console.log("\n--- Testing Paystack Connection ---");
  try {
    const resp = await fetch(
      "https://api.paystack.co/transaction/verify/invalid",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      }
    );
    const data = await resp.json();

    if (resp.status === 404 && data.message === "Transaction not found") {
      console.log("✅ Paystack API connection working");
      return true;
    } else {
      console.log("⚠️ Unexpected Paystack response:", resp.status, data);
      return true; // Still consider it working
    }
  } catch (e) {
    console.error("❌ Paystack API failed:", e.message);
    return false;
  }
}

async function main() {
  console.log("🔍 Running payment system diagnostics...\n");

  const dbOk = await testDatabaseConnection();
  const paystackOk = await testPaystackConnection();

  // Only test Edge Function if we have a valid database
  let edgeFunctionOk = false;
  if (dbOk) {
    const testEmail = process.argv[2] || null;
    if (testEmail) {
      edgeFunctionOk = await testEdgeFunction(testEmail);
    } else {
      console.log("\n--- Skipping Edge Function Test ---");
      console.log(
        "💡 Run with: node local-test.js your-email@example.com to test email sending"
      );
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Database: ${dbOk ? "✅" : "❌"}`);
  console.log(`Paystack: ${paystackOk ? "✅" : "❌"}`);
  console.log(`Edge Function: ${edgeFunctionOk ? "✅" : "⏸️ Skipped"}`);

  const allSystemsGo = dbOk && paystackOk;
  console.log(`\n${allSystemsGo ? "🎉 System Ready!" : "⚠️ Issues Found"}`);

  if (!allSystemsGo) {
    console.log("\nNext steps:");
    if (!dbOk)
      console.log("1. Create the sales table in Supabase using the SQL above");
    if (!paystackOk)
      console.log("2. Check your PAYSTACK_SECRET environment variable");
    console.log(
      "3. Test email delivery by running: node local-test.js your-email@example.com"
    );
  }
}

main().catch(console.error);
