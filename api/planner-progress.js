import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "./rateLimit.js";
import { logger } from "./logger.js";

// --- Initialize Supabase Client (with safety check) ---
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// Log a warning if Supabase isn't configured, so you know why it's not working.
if (!supabase) {
  console.warn(
    "[PLANNER-PROGRESS] Supabase environment variables are not set. The API will be non-functional."
  );
}

/**
 * Verify token signature
 */
function verifySignature({ token, email, expires, sig }) {
  const SECRET =
    process.env.DOWNLOAD_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (!token || !email || !expires || !sig || !SECRET) {
    return { ok: false, error: "Missing parameters or secret" };
  }
  const exp = Number(expires);
  if (!Number.isFinite(exp) || Date.now() > exp) {
    return { ok: false, error: "Expired token" };
  }
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(`${token}|${email}|${expires}`);
  const expectedSig = hmac.digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return { ok: false, error: "Invalid signature" };
    }
  } catch (error) {
    return { ok: false, error: "Invalid signature format" };
  }
  return { ok: true };
}

/**
 * Load progress (GET)
 */
async function handleLoadProgress(req, res) {
  if (!supabase) {
    return res
      .status(503)
      .json({ error: "Database service is not configured." });
  }
  try {
    const { token, email, expires, sig } = req.query;
    const verification = verifySignature({ token, email, expires, sig });
    if (!verification.ok) {
      logger.warn(
        `[PROGRESS] Load failed - ${verification.error} for: ${email?.replace(/(.{2}).*(@.*)/, "$1***$2")}`
      );
      return res.status(401).json({ error: verification.error });
    }
    const { data, error } = await supabase
      .from("user_progress")
      .select("data")
      .eq("email", email)
      .eq("token", token)
      .maybeSingle();
    if (error) {
      logger.error("[PROGRESS] Load DB error:", error);
      return res.status(500).json({ error: "Failed to load progress" });
    }
    logger.info(
      `[PROGRESS] ✅ Loaded progress for: ${email.replace(/(.{2}).*(@.*)/, "$1***$2")}`
    );
    return res.status(200).json({ ok: true, progress: data?.data || null });
  } catch (error) {
    logger.error("[PROGRESS] Load unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Save progress (POST)
 */
async function handleSaveProgress(req, res) {
  if (!supabase) {
    return res
      .status(503)
      .json({ error: "Database service is not configured." });
  }
  try {
    const { token, email, expires, sig, progress } = req.body || {};
    const verification = verifySignature({ token, email, expires, sig });
    if (!verification.ok) {
      logger.warn(
        `[PROGRESS] Save failed - ${verification.error} for: ${email?.replace(/(.{2}).*(@.*)/, "$1***$2")}`
      );
      return res.status(401).json({ error: verification.error });
    }
    if (typeof progress !== "object" || progress == null) {
      logger.warn(
        `[PROGRESS] Invalid progress payload for: ${email.replace(/(.{2}).*(@.*)/, "$1***$2")}`
      );
      return res.status(400).json({ error: "Invalid progress data" });
    }
    const payload = {
      email,
      token,
      data: progress,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("user_progress")
      .upsert(payload, { onConflict: "email,token" });
    if (error) {
      logger.error("[PROGRESS] Save DB error:", error);
      return res.status(500).json({ error: "Failed to save progress" });
    }
    logger.info(
      `[PROGRESS] ✅ Saved progress for: ${email.replace(/(.{2}).*(@.*)/, "$1***$2")}`
    );
    return res.status(200).json({ ok: true });
  } catch (error) {
    logger.error("[PROGRESS] Save unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Main handler function that routes requests
async function mainHandler(req, res) {
  if (req.method === "GET") {
    return handleLoadProgress(req, res);
  }
  if (req.method === "POST") {
    return handleSaveProgress(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res
    .status(405)
    .json({ error: "Method not allowed. Use GET or POST." });
}

// Export the rate-limited handler
export default rateLimit(mainHandler, 120, 60000);
