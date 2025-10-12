-- ============================================
-- Database Verification Queries
-- ============================================
-- Run these in Supabase SQL Editor to verify everything works
-- ============================================

-- 1. Check new columns were added to web_app_users
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'web_app_users' 
  AND column_name IN ('auth_user_id', 'bride_name', 'wedding_date', 'access_expires_at', 'access_days', 'is_onboarded')
ORDER BY column_name;

-- Expected: 6 rows showing all new columns

-- ============================================

-- 2. Check email column was added to user_progress
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
  AND column_name = 'email';

-- Expected: 1 row showing email column

-- ============================================

-- 3. Verify functions were created
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('check_user_access', 'update_login_tracking', 'complete_onboarding', 'prevent_bride_name_change')
ORDER BY routine_name;

-- Expected: 4 rows (3 functions + 1 trigger function)

-- ============================================

-- 4. Verify trigger was created
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'enforce_bride_name_immutability';

-- Expected: 1 row showing UPDATE trigger on web_app_users

-- ============================================

-- 5. Test the check_user_access function (will return "no purchase" for test email)
SELECT * FROM public.check_user_access('test@example.com');

-- Expected: has_access = false, reason = 'No purchase found for this email'

-- ============================================

-- 6. View current web_app_users structure
SELECT 
  email,
  auth_user_id,
  bride_name,
  wedding_date,
  is_onboarded,
  access_expires_at,
  access_days,
  created_at
FROM public.web_app_users
LIMIT 5;

-- Expected: Shows your current users with new columns (all NULL if no data yet)

-- ============================================
-- All checks passed? You're ready to deploy! 🚀
-- ============================================
