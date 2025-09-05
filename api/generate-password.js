import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { sendMailerSendEmail } from "./mail-transport.js";

// POST { reference, email, fileName }
// Headers: x-admin-key
// Verifies Paystack transaction, generates password, stores in DB, sends email

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "private";
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").replace(/\/$/, "");
const ADMIN_SECRET = process.env.ADMIN_SECRET;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function verifyPaystackTransaction(reference) {
  const resp = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(
      reference
    )}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    }
  );

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Paystack verify failed: ${resp.status} ${body}`);
  }

  const data = await resp.json();
  if (data?.data?.status !== "success") {
    throw new Error("Transaction not successful");
  }

  return data.data;
}

function generatePassword(length = 12) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic auth protection
  const providedKey =
    req.headers["x-admin-key"] || req.headers["x-admin-secret"];
  if (!ADMIN_SECRET || providedKey !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { reference, email, fileName } = req.body || {};
  if (!reference || !email) {
    return res.status(400).json({ error: "reference and email are required" });
  }

  try {
    // Verify the transaction with Paystack
    const txData = await verifyPaystackTransaction(reference);

    // Check if already exists
    const { data: existing } = await supabase
      .from("sales")
      .select("*")
      .eq("tx_ref", reference)
      .limit(1);

    if (existing && existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Password already generated for this transaction" });
    }

    // Generate and hash password
    const plainPassword = generatePassword(12);
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // Insert into sales table
    const saleData = {
      tx_ref: reference,
      email: email,
      password_hash: passwordHash,
      file_name: fileName || "Hausa_Wedding_Guide.pdf",
      downloads: 0,
      max_downloads: 3,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from("sales")
      .insert([saleData]);
    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res.status(500).json({ error: "Database error" });
    }

    // Send email with password
    const downloadUrl = `${PUBLIC_BASE_URL}/download.html`;
    const subject = "Your Hausa Wedding Guide — Download Instructions";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #CE805C;">Thank you for your purchase!</h2>
        <p>Your Hausa Wedding Guide is ready for download.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Your unique password:</strong> <code style="background-color: #e9e9e9; padding: 4px 8px; border-radius: 4px;">${plainPassword}</code></p>
          <p><strong>Download page:</strong> <a href="${downloadUrl}" style="color: #CE805C;">${downloadUrl}</a></p>
        </div>
        <p><small>Note: You have up to 3 downloads. The download link expires after 5 minutes for security.</small></p>
      </div>
    `;

    const textVersion = `Thank you for your purchase!\n\nYour password: ${plainPassword}\nDownload page: ${downloadUrl}\n\nNote: You have up to 3 downloads.`;

    let emailWarning = false;
    try {
      await sendMailerSendEmail({
        toEmail: email,
        subject: subject,
        html: html,
        text: textVersion,
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      emailWarning = true;
    }

    return res.status(200).json({
      ok: true,
      warning: emailWarning ? "email_failed" : null,
      message:
        "Password generated and saved to database" +
        (emailWarning
          ? ". Email delivery failed."
          : ". Email sent successfully."),
    });
  } catch (error) {
    console.error("Generate password error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
