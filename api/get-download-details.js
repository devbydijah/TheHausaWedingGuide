// POST { reference }
// Verifies Paystack transaction; if successful and not already recorded,
// generate password, insert sale row, send email, and return { password, download_url }

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { sendDownloadEmail } from "./email.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "private";
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").replace(/\/$/, "");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function verifyPaystack(reference) {
  const resp = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(
      reference
    )}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    }
  );
  if (!resp.ok) throw new Error("paystack verify failed");
  return resp.json();
}

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const { reference } = req.body || {};
  if (!reference) return res.status(400).json({ error: "reference required" });

  try {
    console.log("Verifying Paystack transaction:", reference);
    const verify = await verifyPaystack(reference);
    const data = verify.data || {};

    if (data.status !== "success") {
      return res.status(400).json({ error: "payment not successful" });
    }

    const email = (data.customer && data.customer.email) || "";
    const fileName =
      (data.metadata && data.metadata.file_name) || "Hausa_Wedding_Guide.pdf";

    console.log("Payment verified for email:", email);

    // Check if already exists for this reference
    const { data: existing } = await supabase
      .from("sales")
      .select("*")
      .eq("tx_ref", reference)
      .limit(1);
    if (existing && existing.length > 0) {
      console.log("Transaction already processed");
      // Create signed url for existing transaction
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
      tx_ref: reference,
      email,
      password_hash: passwordHash,
      file_name: fileName,
      downloads: 0,
      max_downloads: 3,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("sales").insert([payload]);
    if (error) {
      console.error("Supabase insert error", error.message);
      return res.status(500).json({ error: "database error" });
    }

    // Create signed URL
    const expiresIn = 60 * 5; // 5 minutes
    const { data: urlData, error: urlError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(fileName, expiresIn);

    if (urlError) {
      console.error("Signed URL error:", urlError);
      return res
        .status(500)
        .json({ error: "failed to generate download link" });
    }

    console.log("Generated signed URL, sending email via Resend API");

    // Send email using direct Resend API
    try {
      console.log("Sending email to:", email);

      await sendDownloadEmail({
        email: email,
        password: plainPassword,
        downloadUrl: urlData.signedUrl,
      });

      console.log("Email sent successfully via Resend API");
    } catch (e) {
      console.error("Email send error:", e.message);
      // Continue anyway - user will still get the password on screen
    }

    return res.status(200).json({
      ok: true,
      password: plainPassword,
      download_url: urlData.signedUrl,
      message: "Payment verified! Check your email for backup instructions.",
    });
  } catch (err) {
    console.error("get-download-details error", err);
    return res.status(500).json({ error: "server error" });
  }
}
