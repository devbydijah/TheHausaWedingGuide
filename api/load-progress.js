const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const { rateLimit } = require("../lib/rateLimit");
const { logger, maskEmail } = require("../lib/logger");

function verifySig({ token, email, expires, sig }) {
  const SECRET =
    process.env.DOWNLOAD_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (!token || !email || !expires || !sig || !SECRET)
    return { ok: false, error: "Missing parameters" };
  const exp = Number(expires);
  if (!Number.isFinite(exp) || Date.now() > exp)
    return { ok: false, error: "Expired token" };
  const h = crypto
    .createHmac("sha256", SECRET)
    .update(`${token}|${email}|${expires}`)
    .digest("hex");
  const equal = (a, b) =>
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  if (!equal(sig, h)) return { ok: false, error: "Invalid signature" };
  return { ok: true };
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = rateLimit(
  async (req, res) => {
    try {
      if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });
      const { token, email, expires, sig } = req.body || {};

      const v = verifySig({ token, email, expires, sig });
      if (!v.ok) return res.status(401).json({ error: v.error });

      // load row by email+token
      const { data, error } = await supabase
        .from("user_progress")
        .select("data")
        .eq("email", email)
        .eq("token", token)
        .maybeSingle();

      if (error) {
        logger.error("load-progress db error", error);
        return res.status(500).json({ error: "DB error" });
      }

      return res.status(200).json({
        ok: true,
        progress: data?.data || null,
      });
    } catch (e) {
      logger.error("load-progress unexpected", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  /* limit */ 60,
  /* windowMs */ 60_000
);
