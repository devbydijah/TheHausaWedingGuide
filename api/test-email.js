// Simple test API that bypasses Paystack verification for debugging
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
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "email required" });
  }

  try {
    console.log("Testing Resend with email:", email);

    await sendEmail({
      toEmail: email,
      subject: "Resend Test",
      html: "<h2>Test Email</h2><p>If you receive this, Resend is working!</p>",
      text: "Test Email - If you receive this, Resend is working!",
    });

    console.log("Resend test successful");
    return res
      .status(200)
      .json({ ok: true, message: "Test email sent successfully" });
  } catch (error) {
    console.error("Resend test failed:", error);
    return res.status(500).json({
      error: "Resend failed",
      details: error.message,
      status: error.status,
    });
  }
}
