/**
 * Supabase Client Configuration
 *
 * Provides cloud database access for multi-device sync of user planning data.
 * Used by the Interactive Wedding Guide to persist:
 * - Vision quiz results
 * - Budget builder data
 * - Vendor tracker entries
 * - Timeline tasks
 * - User preferences (dark mode, etc.)
 */

import { createClient } from "@supabase/supabase-js";

// Supabase project credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase credentials not configured. Running in localStorage-only mode.\n" +
      "To enable cloud sync, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env"
  );
}

// Create Supabase client (will be null if credentials missing)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        db: {
          schema: "public",
        },
        global: {
          headers: {
            "X-Client-Info": "hausa-wedding-guide",
          },
        },
      })
    : null;

/**
 * Check if Supabase is configured and available
 * @returns {boolean} True if Supabase client is ready
 */
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

/**
 * Helper function to handle Supabase errors consistently
 * @param {Error} error - Supabase error object
 * @param {string} context - Description of what operation failed
 */
export const handleSupabaseError = (error, context = "Operation") => {
  console.error(`Supabase Error [${context}]:`, error);

  // User-friendly error messages
  const errorMessages = {
    "Invalid JWT": "Your session has expired. Please login again.",
    "duplicate key": "This record already exists.",
    "violates foreign key": "Related record not found.",
    "permission denied": "You do not have permission to perform this action.",
  };

  // Find matching error message
  const userMessage = Object.keys(errorMessages).find((key) =>
    error.message?.includes(key)
  );

  return {
    error: true,
    message: userMessage
      ? errorMessages[userMessage]
      : "An unexpected error occurred.",
    details: error.message,
  };
};

/**
 * Test Supabase connection
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const testConnection = async () => {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase not configured",
    };
  }

  try {
    // Simple query to test connection
    const { error } = await supabase
      .from("web_app_users")
      .select("count", { count: "exact", head: true });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Connected to Supabase",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export default supabase;
