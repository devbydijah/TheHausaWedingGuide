// File: lib/logger.js
// Logger that masks email usernames for PII safety.
function maskEmail(email) {
  const [user, domain] = (email || "").split("@");
  if (!domain) return email;
  if (user.length <= 1) return `*@${domain}`;
  return `${user[0]}${"*".repeat(user.length - 1)}@${domain}`;
}

function applyMask(arg) {
  if (typeof arg === "string" && arg.includes("@")) {
    return maskEmail(arg);
  }
  return arg;
}

const logger = {
  log: (...args) => {
    const masked = args.map(applyMask);
    console.log(...masked);
  },
  warn: (...args) => {
    const masked = args.map(applyMask);
    console.warn(...masked);
  },
  error: (...args) => {
    const masked = args.map(applyMask);
    console.error(...masked);
  },
  // For convenience, log a message with a masked email
  infoWithEmail: (msg, email) => {
    console.log(`${msg} ${maskEmail(email)}`);
  },
};

module.exports = { maskEmail, logger };
