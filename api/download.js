// POST { email, password }
// Returns { download_url } with signed URL to download the file if valid

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
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });

  try {
    // Find latest sale for this email
    const { data: rows, error } = await supabase
      .from("sales")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;
    if (!rows || rows.length === 0)
      return res
        .status(404)
        .json({ error: "No purchase found for this email" });

    const sale = rows[0];

    // Verify password
    const match = await bcrypt.compare(password, sale.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    // Check download limit
    if (sale.downloads >= sale.max_downloads) {
      return res.status(403).json({ error: "Maximum downloads exceeded" });
    }

    // Increment download counter
    const { error: updateError } = await supabase
      .from("sales")
      .update({ downloads: sale.downloads + 1 })
      .eq("id", sale.id);

    if (updateError)
      console.error("Update downloads error", updateError.message);

    // Create signed URL (5 minutes)
    const expiresIn = 60 * 5;
    const { data, error: urlError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(sale.file_name, expiresIn);

    if (urlError) {
      console.error("Signed URL error:", urlError);
      return res
        .status(500)
        .json({ error: "Failed to generate download link" });
    }

    return res.status(200).json({
      download_url: data.signedUrl,
      downloads_remaining: sale.max_downloads - sale.downloads - 1,
    });
  } catch (err) {
    console.error("Download handler error", err);
    return res.status(500).json({ error: "server error" });
  }
}
