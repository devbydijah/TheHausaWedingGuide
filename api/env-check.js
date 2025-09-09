// Check environment variables without exposing them
export default async function handler(req, res) {
  const envCheck = {
    PAYSTACK_SECRET: !!process.env.PAYSTACK_SECRET,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || "private",
    PUBLIC_BASE_URL: !!process.env.PUBLIC_BASE_URL,
  };

  console.log("Environment check:", envCheck);

  return res.status(200).json({
    status: "environment_check",
    variables: envCheck,
    missing: Object.entries(envCheck)
      .filter(([key, value]) => !value)
      .map(([key]) => key),
    timestamp: new Date().toISOString(),
  });
}
