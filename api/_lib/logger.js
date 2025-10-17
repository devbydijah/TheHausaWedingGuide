// api/_lib/logger.js

// A simple logger that prefixes messages.
// This will be expanded later with more advanced logging services.
export const logger = {
  info: (...args) => console.log("[INFO]", ...args),
  warn: (...args) => console.warn("[WARN]", ...args),
  error: (...args) => console.error("[ERROR]", ...args),
};
