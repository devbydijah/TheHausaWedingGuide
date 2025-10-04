-- ============================================
-- FIX: Update RLS Policies for Shared Password Auth
-- ============================================
-- Our app uses shared password authentication, not Supabase Auth
-- So we need to disable RLS or create permissive policies

-- Option 1: Disable RLS temporarily (for testing)
ALTER TABLE public.web_app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- Option 2: Create permissive policies (recommended)
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own record" ON public.web_app_users;
DROP POLICY IF EXISTS "Users can update own record" ON public.web_app_users;
DROP POLICY IF EXISTS "System can insert users" ON public.web_app_users;
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

-- Re-enable RLS
ALTER TABLE public.web_app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for anonymous access
-- (Since we use shared password, all authenticated users can access)

-- web_app_users policies
CREATE POLICY "Allow all operations on web_app_users"
  ON public.web_app_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- user_progress policies  
CREATE POLICY "Allow all operations on user_progress"
  ON public.user_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify policies
SELECT tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
