// Validate if an email has access to the Interactive Guide
// This checks if the email has a valid token or purchase record
// POST /api/validate-access { email: string, password: string }

import tokenDB from "../lib/database.cjs";

const SHARED_PASSWORD =
  process.env.VITE_SHARED_PASSWORD || "HausaPlanner2025";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { email, password } = body;

    // Validate input
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Check password
    if (password !== SHARED_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Check if email has any valid token (purchased access)
    const hasAccess = await tokenDB.hasValidAccess(email);

    if (!hasAccess) {
      return res.status(403).json({ 
        error: "No valid purchase found for this email",
        hasAccess: false 
      });
    }

    // Success - user has access
    return res.status(200).json({ 
      hasAccess: true,
      email 
    });
  } catch (error) {
    console.error("/api/validate-access error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
