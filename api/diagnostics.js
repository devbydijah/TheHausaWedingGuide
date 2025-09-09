// Comprehensive diagnostic tool for the payment system
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export default async function handler(req, res) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    results: [],
    summary: { passed: 0, failed: 0, warnings: 0 },
  };

  function addResult(test, status, message, details = null) {
    diagnostics.results.push({ test, status, message, details });
    diagnostics.summary[status]++;
  }

  try {
    // Test 1: Environment Variables
    addResult(
      "Environment Variables",
      PAYSTACK_SECRET && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
        ? "passed"
        : "failed",
      PAYSTACK_SECRET && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
        ? "All required environment variables are set"
        : "Missing required environment variables",
      {
        PAYSTACK_SECRET: !!PAYSTACK_SECRET,
        SUPABASE_URL: !!SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
      }
    );

    // Test 2: Supabase Connection
    try {
      const { error } = await supabase.from("sales").select("id").limit(1);
      if (error) {
        if (error.message.includes('relation "sales" does not exist')) {
          addResult(
            "Supabase Sales Table",
            "failed",
            "Sales table does not exist in database",
            error
          );
        } else {
          addResult(
            "Supabase Connection",
            "failed",
            `Database error: ${error.message}`,
            error
          );
        }
      } else {
        addResult(
          "Supabase Connection",
          "passed",
          "Successfully connected to database and sales table exists"
        );
      }
    } catch (e) {
      addResult(
        "Supabase Connection",
        "failed",
        `Connection failed: ${e.message}`,
        e
      );
    }

    // Test 3: Paystack API Connection
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
        addResult(
          "Paystack API",
          "passed",
          "Paystack API connection working (expected 404 for invalid reference)"
        );
      } else {
        addResult(
          "Paystack API",
          "warnings",
          `Unexpected Paystack response: ${resp.status}`,
          data
        );
      }
    } catch (e) {
      addResult(
        "Paystack API",
        "failed",
        `Paystack API connection failed: ${e.message}`,
        e
      );
    }

    // Test 4: Edge Function Test (with a safe test)
    if (req.method === "POST" && req.body?.testEmail) {
      try {
        const { data: emailResponse, error: emailError } =
          await supabase.functions.invoke("resend-email", {
            body: {
              to: req.body.testEmail,
              password: "DIAGNOSTIC_TEST_123",
              downloadUrl: "https://example.com/diagnostic-test",
            },
          });

        if (emailError) {
          addResult(
            "Edge Function Test",
            "failed",
            `Edge Function failed: ${emailError.message}`,
            emailError
          );
        } else {
          addResult(
            "Edge Function Test",
            "passed",
            "Edge Function executed successfully",
            emailResponse
          );
        }
      } catch (e) {
        addResult(
          "Edge Function Test",
          "failed",
          `Edge Function error: ${e.message}`,
          e
        );
      }
    } else {
      addResult(
        "Edge Function Test",
        "warnings",
        "Skipped - send POST request with testEmail to run this test"
      );
    }

    // Test 5: Password Generation
    try {
      const testPassword = Math.random().toString(36).substring(2, 8);
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const isValid = await bcrypt.compare(testPassword, hashedPassword);

      if (isValid) {
        addResult(
          "Password Generation",
          "passed",
          "bcrypt password hashing working correctly"
        );
      } else {
        addResult(
          "Password Generation",
          "failed",
          "bcrypt password verification failed"
        );
      }
    } catch (e) {
      addResult(
        "Password Generation",
        "failed",
        `Password generation error: ${e.message}`,
        e
      );
    }

    return res.status(200).json({
      ok: true,
      diagnostics,
      instructions: {
        "To test email":
          "Send POST request with { testEmail: 'your-email@example.com' }",
        "Database issue":
          "If sales table doesn't exist, you need to run the SQL schema",
        "Next steps":
          diagnostics.summary.failed > 0
            ? "Fix failed tests first"
            : "System appears healthy",
      },
    });
  } catch (err) {
    addResult(
      "System Error",
      "failed",
      `Diagnostic system error: ${err.message}`,
      err
    );
    return res.status(500).json({
      ok: false,
      diagnostics,
      error: err.message,
    });
  }
}
