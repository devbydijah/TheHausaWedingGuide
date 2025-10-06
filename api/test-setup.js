// File: api/test-setup.js
// GET /api/test-setup
// Simple endpoint to test if the server is running and environment is configured
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check environment variables
  const envStatus = {
    supabase_url: !!process.env.VITE_SUPABASE_URL,
    supabase_anon_key: !!process.env.VITE_SUPABASE_ANON_KEY,
    paystack_test_key: !!process.env.PAYSTACK_TEST_SECRET_KEY,
    paystack_live_key: !!process.env.PAYSTACK_SECRET_KEY,
    resend_api_key: !!process.env.RESEND_API_KEY,
    from_email: !!process.env.FROM_EMAIL,
    shared_password: !!process.env.VITE_SHARED_PASSWORD,
  };

  const allConfigured = Object.values(envStatus).every(Boolean);

  res.status(200).json({
    status: allConfigured ? "success" : "partial",
    message: allConfigured
      ? "All environment variables configured"
      : "Some environment variables missing",
    environment: envStatus,
    timestamp: new Date().toISOString(),
  });
}
