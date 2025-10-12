-- ============================================
-- Hausa Wedding Guide - Complete Database Setup
-- ============================================
-- 
-- This is the COMPLETE database setup for fresh installations.
-- Run this ONLY ONCE when setting up a new Supabase project.
--
-- Includes:
-- 1. Tables (web_app_users, user_progress)
-- 2. Authentication fields
-- 3. RLS policies
-- 4. Functions (access check, login tracking, onboarding)
-- 5. Triggers (bride_name immutability)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: web_app_users
-- ============================================
-- Tracks users who purchased access to the interactive guide
-- ============================================

CREATE TABLE IF NOT EXISTS public.web_app_users (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User identification
  email TEXT UNIQUE NOT NULL,
  
  -- Supabase Auth integration
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personalization (immutable after onboarding)
  bride_name TEXT,
  wedding_date DATE,
  is_onboarded BOOLEAN DEFAULT FALSE,
  
  -- Access control (20-day period)
  access_expires_at TIMESTAMPTZ,
  access_days INTEGER DEFAULT 20,
  
  -- Purchase tracking
  paystack_reference TEXT,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Activity tracking
  last_login TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_web_app_users_email ON public.web_app_users(email);
CREATE INDEX IF NOT EXISTS idx_web_app_users_auth_user_id ON public.web_app_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_web_app_users_paystack_ref ON public.web_app_users(paystack_reference);

-- ============================================
-- TABLE: user_progress
-- ============================================
-- Stores all planning data for each user in JSONB format
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_progress (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign key to user
  user_id UUID NOT NULL REFERENCES public.web_app_users(id) ON DELETE CASCADE,
  
  -- Email for easier querying
  email TEXT,
  
  -- Planning data (JSONB for flexibility)
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Sync metadata
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one progress record per user
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_email ON public.user_progress(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_updated_at ON public.user_progress(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_data ON public.user_progress USING GIN (data);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on both tables
ALTER TABLE public.web_app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: web_app_users
-- ============================================

-- Users can view their own record
CREATE POLICY "Authenticated users can view own record"
  ON public.web_app_users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Users can update their own record
CREATE POLICY "Authenticated users can update own record"
  ON public.web_app_users
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid());

-- System can insert users (for webhook)
CREATE POLICY "System can insert users"
  ON public.web_app_users
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES: user_progress
-- ============================================

-- Users can view their own progress
CREATE POLICY "Authenticated users can view own progress"
  ON public.user_progress
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM public.web_app_users 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Users can insert their own progress
CREATE POLICY "Authenticated users can insert own progress"
  ON public.user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.web_app_users 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Users can update their own progress
CREATE POLICY "Authenticated users can update own progress"
  ON public.user_progress
  FOR UPDATE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM public.web_app_users 
      WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.web_app_users 
      WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTION: Check if user access is valid
-- ============================================

CREATE OR REPLACE FUNCTION public.check_user_access(user_email TEXT)
RETURNS TABLE (
  has_access BOOLEAN,
  days_remaining INTEGER,
  expires_at TIMESTAMPTZ,
  bride_name TEXT,
  is_onboarded BOOLEAN,
  reason TEXT
) AS $$
DECLARE
  user_record RECORD;
  now_ts TIMESTAMPTZ := NOW();
BEGIN
  -- Find user by email
  SELECT * INTO user_record
  FROM public.web_app_users
  WHERE email = user_email;
  
  -- User not found
  IF user_record IS NULL THEN
    RETURN QUERY SELECT 
      FALSE, 
      0, 
      NULL::TIMESTAMPTZ, 
      NULL::TEXT, 
      FALSE,
      'No purchase found for this email'::TEXT;
    RETURN;
  END IF;
  
  -- Check if access expired
  IF user_record.access_expires_at IS NOT NULL AND now_ts > user_record.access_expires_at THEN
    RETURN QUERY SELECT 
      FALSE,
      0,
      user_record.access_expires_at,
      user_record.bride_name,
      user_record.is_onboarded,
      'Access period expired'::TEXT;
    RETURN;
  END IF;
  
  -- Calculate days remaining
  DECLARE
    days_left INTEGER;
  BEGIN
    IF user_record.access_expires_at IS NULL THEN
      days_left := user_record.access_days; -- Full period remaining
    ELSE
      days_left := EXTRACT(DAY FROM (user_record.access_expires_at - now_ts))::INTEGER;
      IF days_left < 0 THEN days_left := 0; END IF;
    END IF;
    
    -- Access is valid
    RETURN QUERY SELECT 
      TRUE,
      days_left,
      user_record.access_expires_at,
      user_record.bride_name,
      user_record.is_onboarded,
      'Access granted'::TEXT;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.check_user_access(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_access(TEXT) TO anon;

-- ============================================
-- FUNCTION: Update login tracking
-- ============================================

CREATE OR REPLACE FUNCTION public.update_login_tracking(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.web_app_users
  SET 
    last_login = NOW(),
    login_count = login_count + 1,
    -- Set access_expires_at on first login if not already set
    access_expires_at = CASE 
      WHEN access_expires_at IS NULL 
      THEN NOW() + (access_days || ' days')::INTERVAL
      ELSE access_expires_at
    END
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.update_login_tracking(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_login_tracking(TEXT) TO anon;

-- ============================================
-- FUNCTION: Complete onboarding
-- ============================================

CREATE OR REPLACE FUNCTION public.complete_onboarding(
  user_email TEXT,
  p_bride_name TEXT,
  p_wedding_date DATE DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  result JSON;
BEGIN
  -- Find user
  SELECT * INTO user_record
  FROM public.web_app_users
  WHERE email = user_email;
  
  IF user_record IS NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'User not found');
  END IF;
  
  -- Check if already onboarded (bride_name is immutable)
  IF user_record.bride_name IS NOT NULL AND user_record.is_onboarded = TRUE THEN
    RETURN json_build_object(
      'success', FALSE, 
      'error', 'Profile already completed. Bride name cannot be changed.',
      'bride_name', user_record.bride_name
    );
  END IF;
  
  -- Update user record
  UPDATE public.web_app_users
  SET 
    bride_name = TRIM(p_bride_name),
    wedding_date = p_wedding_date,
    is_onboarded = TRUE,
    updated_at = NOW()
  WHERE email = user_email;
  
  -- Return success
  SELECT json_build_object(
    'success', TRUE,
    'bride_name', TRIM(p_bride_name),
    'wedding_date', p_wedding_date
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.complete_onboarding(TEXT, TEXT, DATE) TO authenticated;

-- ============================================
-- TRIGGER: Prevent bride_name modification
-- ============================================

CREATE OR REPLACE FUNCTION public.prevent_bride_name_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if bride_name is being changed after it's been set
  IF OLD.bride_name IS NOT NULL 
     AND OLD.is_onboarded = TRUE 
     AND NEW.bride_name IS DISTINCT FROM OLD.bride_name THEN
    RAISE EXCEPTION 'bride_name cannot be modified after onboarding';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_bride_name_immutability ON public.web_app_users;
CREATE TRIGGER enforce_bride_name_immutability
  BEFORE UPDATE ON public.web_app_users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_bride_name_change();

-- ============================================
-- VERIFICATION QUERIES (commented out)
-- ============================================

-- Uncomment these to verify the setup:

-- 1. Check tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name IN ('web_app_users', 'user_progress');

-- 2. Check columns
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'web_app_users' ORDER BY ordinal_position;

-- 3. Check functions
-- SELECT routine_name FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name IN ('check_user_access', 'update_login_tracking', 'complete_onboarding');

-- 4. Test access check
-- SELECT * FROM public.check_user_access('test@example.com');

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
-- 
-- Next steps:
-- 1. Add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables
-- 2. Deploy your application
-- 3. Test with a Paystack test payment
-- 
-- ============================================
