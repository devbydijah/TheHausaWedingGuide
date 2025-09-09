// Debug version of download API to see what's happening
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "private";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export default async function handler(req, res) {
  console.log("=== DOWNLOAD DEBUG API CALLED ===");
  console.log("Method:", req.method);
  console.log("Body:", req.body);

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const { email, password } = req.body || {};
  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ error: "email and password required" });
  }

  try {
    console.log("Looking for sales for email:", email);

    // Find latest sale for this email
    const { data: rows, error } = await supabase
      .from("sales")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    console.log("Database query result:", { rows, error });

    if (error) {
      console.error("Database error:", error);
      return res
        .status(500)
        .json({ error: "Database error: " + error.message });
    }

    if (!rows || rows.length === 0) {
      console.log("No purchase found for email:", email);
      return res
        .status(404)
        .json({ error: "No purchase found for this email" });
    }

    const sale = rows[0];
    console.log("Found sale:", {
      id: sale.id,
      email: sale.email,
      download_count: sale.download_count,
      created_at: sale.created_at,
    });

    // Verify password
    console.log("Verifying password...");
    const match = await bcrypt.compare(password, sale.password_hash);
    console.log("Password match:", match);

    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Check download limit (max 3 downloads)
    const maxDownloads = 3;
    console.log(`Download count: ${sale.download_count}/${maxDownloads}`);

    if (sale.download_count >= maxDownloads) {
      return res.status(403).json({ error: "Maximum downloads exceeded" });
    }

    // Increment download counter
    console.log("Incrementing download counter...");
    const { error: updateError } = await supabase
      .from("sales")
      .update({ download_count: sale.download_count + 1 })
      .eq("id", sale.id);

    if (updateError) {
      console.error("Update downloads error:", updateError.message);
    } else {
      console.log("Download counter updated successfully");
    }

    // Create signed URL (5 minutes) - use fixed filename
    const fileName = "Hausa_Wedding_Guide.pdf";
    const expiresIn = 60 * 5;
    console.log("Creating signed URL for:", fileName);

    const { data, error: urlError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(fileName, expiresIn);

    console.log("Signed URL result:", { data, urlError });

    if (urlError) {
      console.error("Signed URL error:", urlError);
      return res.status(500).json({
        error: "Failed to generate download link",
        details: urlError.message,
      });
    }

    const downloadsRemaining = maxDownloads - (sale.download_count + 1);

    console.log("Success! Returning download URL");
    return res.status(200).json({
      download_url: data.signedUrl,
      downloads_remaining: downloadsRemaining,
    });
  } catch (err) {
    console.error("Download debug error:", err);
    return res.status(500).json({
      error: "server error",
      details: err.message,
    });
  }
}
