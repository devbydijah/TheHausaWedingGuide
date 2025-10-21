import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "Supabase credentials not configured. Running in localStorage-only mode.\nTo enable cloud sync, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env"
  );
  // In a real-world scenario, you might want to handle this more gracefully
  // For now, we'll allow the app to run without a functional Supabase client for local testing.
  supabase = null;
}

export default supabase;
