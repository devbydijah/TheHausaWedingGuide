// Planner Progress Handler - Merged endpoint
// Handles both loading and saving wedding planner progress
// GET /api/planner-progress?token=xxx&expires=xxx&email=xxx&sig=xxx  → Load progress
// POST /api/planner-progress → Save progress (body: { token, expires, email, sig, progress })

const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const { rateLimit } = require("./_lib/rateLimit");
const { logger } = require("../lib/logger");

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
  try {
    const { token, email, expires, sig } = req.query;

    // Verify signature
    const verification = verifySignature({ token, email, expires, sig });
    if (!verification.ok) {
      logger.warn(
        `[PROGRESS] Load failed - ${verification.error} for: ${email?.replace(/(.{2}).*(@.*)/, "$1***$2")}`
      );
      return res.status(401).json({ error: verification.error });
    }

    // Load progress from Supabase
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

    return res.status(200).json({
      ok: true,
      progress: data?.data || null,
    });
  } catch (error) {
    logger.error("[PROGRESS] Load unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Save progress (POST)
 */
async function handleSaveProgress(req, res) {
  try {
    const { token, email, expires, sig, progress } = req.body || {};

    // Verify signature
    const verification = verifySignature({ token, email, expires, sig });
    if (!verification.ok) {
      logger.warn(
        `[PROGRESS] Save failed - ${verification.error} for: ${email?.replace(/(.{2}).*(@.*)/, "$1***$2")}`
      );
      return res.status(401).json({ error: verification.error });
    }

    // Validate progress data
    if (typeof progress !== "object" || progress == null) {
      logger.warn(
        `[PROGRESS] Invalid progress payload for: ${email.replace(/(.{2}).*(@.*)/, "$1***$2")}`
      );
      return res.status(400).json({ error: "Invalid progress data" });
    }

    // Save to Supabase
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

/**
 * Main handler - Routes based on HTTP method
 */
module.exports = rateLimit(
  async (req, res) => {
    if (req.method === "GET") {
      return handleLoadProgress(req, res);
    } else if (req.method === "POST") {
      return handleSaveProgress(req, res);
    } else {
      return res
        .status(405)
        .json({ error: "Method not allowed. Use GET or POST." });
    }
  },
  120, // rate limit: 120 requests
  60_000 // per 60 seconds (1 minute)
);
