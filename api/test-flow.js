// Test API that bypasses Paystack for debugging
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { sendDownloadEmail } from "./email.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "private";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default async function handler(req, res) {
  console.log("=== TEST API CALLED ===");
  console.log("Method:", req.method);
  console.log("Body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, reference } = req.body || {};

  if (!email || !reference) {
    return res.status(400).json({
      error: "email and reference required",
      received: { email: !!email, reference: !!reference },
    });
  }

  try {
    // Get the current domain from request headers
    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const currentDomain = `${protocol}://${host}`;
    console.log("Current domain:", currentDomain);

    console.log("Testing with:", { email, reference });

    // Skip Paystack verification for testing
    const fileName = "Hausa_Wedding_Guide.pdf";

    // Check if already exists
    const { data: existing } = await supabase
      .from("sales")
      .select("*")
      .eq("paystack_reference", reference)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log("Transaction already processed");
      const expiresIn = 60 * 5;
      const { data: urlData } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .createSignedUrl(fileName, expiresIn);

      return res.status(200).json({
        ok: true,
        message: "already_created",
        password: "Check your email for the password",
        download_url: urlData?.signedUrl,
      });
    }

    // Generate new password
    const plainPassword = generatePassword(10);
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    console.log("Generated password, inserting to database");

    // Insert to database
    const payload = {
      paystack_reference: reference,
      email,
      amount: 500000, // 5000 NGN in kobo
      password_hash: passwordHash,
      download_count: 0,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from("sales")
      .insert([payload]);
    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res.status(500).json({
        error: "database error",
        details: insertError.message,
      });
    }

    console.log("Database insert successful");

    // Create signed URL
    const expiresIn = 60 * 5; // 5 minutes
    const { data: urlData, error: urlError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(fileName, expiresIn);

    if (urlError) {
      console.error("Signed URL error:", urlError);
      return res.status(500).json({
        error: "failed to generate download link",
        details: urlError.message,
      });
    }

    console.log("Generated signed URL, attempting to send email");

    // Use dynamic domain from request headers
    const downloadPageUrl = `${currentDomain}/download.html`;

    // Send email
    try {
      await sendDownloadEmail({
        email: email,
        password: plainPassword,
        downloadUrl: downloadPageUrl, // Dynamic URL to download page
      });

      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Email send error:", emailError.message);
      // Don't fail the request if email fails
    }

    return res.status(200).json({
      ok: true,
      password: plainPassword,
      download_url: urlData.signedUrl,
      message: "Test successful! Check your email for download instructions.",
    });
  } catch (err) {
    console.error("Test API error:", err);
    return res.status(500).json({
      error: "server error",
      details: err.message,
    });
  }
}
