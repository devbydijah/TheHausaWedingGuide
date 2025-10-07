-- ============================================
-- Hausa Wedding Guide - Interactive Web App
-- Supabase Database Schema
-- ============================================
-- 
-- This schema supports the Interactive Wedding Guide (Deliverable 2)
-- Separate from the PDF guide sales system (Deliverable 1)
--
-- Purpose: Cloud sync for user planning data across devices
-- Tables: web_app_users, user_progress
-- Security: Row Level Security (RLS) enabled
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: web_app_users
-- ============================================
-- Purpose: Track users who purchased access to the interactive guide
-- Authentication: Uses shared password (same for all users)
-- Unique Identifier: Email address
-- ============================================

CREATE TABLE IF NOT EXISTS public.web_app_users (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User identification
  email TEXT UNIQUE NOT NULL,
  
  -- Purchase tracking
  paystack_reference TEXT, -- Paystack transaction reference
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
CREATE INDEX IF NOT EXISTS idx_web_app_users_paystack_ref ON public.web_app_users(paystack_reference);

-- ============================================
-- TABLE: user_progress
-- ============================================
-- Purpose: Store all planning data for each user
-- Data Structure: JSONB for flexible schema
-- Sync Strategy: Last-write-wins (timestamp-based)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_progress (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign key to user
  user_id UUID NOT NULL REFERENCES public.web_app_users(id) ON DELETE CASCADE,
  
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
CREATE INDEX IF NOT EXISTS idx_user_progress_updated_at ON public.user_progress(updated_at DESC);

-- GIN index for JSONB queries (optional, for future search features)
CREATE INDEX IF NOT EXISTS idx_user_progress_data ON public.user_progress USING GIN (data);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS to ensure users can only access their own data
-- ============================================

-- Enable RLS on both tables
ALTER TABLE public.web_app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: web_app_users
-- ============================================

-- Policy: Users can view their own record
CREATE POLICY "Users can view own record"
  ON public.web_app_users
  FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Users can update their own record (last_login, login_count)
CREATE POLICY "Users can update own record"
  ON public.web_app_users
  FOR UPDATE
  USING (email = current_setting('request.jwt.claims', true)::json->>'email')
  WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: System can insert new users (via webhook/API)
CREATE POLICY "System can insert users"
  ON public.web_app_users
  FOR INSERT
  WITH CHECK (true); -- No restrictions for new user creation

-- ============================================
-- RLS POLICIES: user_progress
-- ============================================

-- Policy: Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON public.user_progress
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM public.web_app_users 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON public.user_progress
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.web_app_users 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Policy: Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON public.user_progress
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM public.web_app_users 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.web_app_users 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- ============================================
-- FUNCTIONS: Auto-update timestamps
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for web_app_users
CREATE TRIGGER update_web_app_users_updated_at
  BEFORE UPDATE ON public.web_app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_progress
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA STRUCTURE
-- ============================================
-- Example of what user_progress.data JSONB contains:
-- {
--   "quiz": {
--     "completed": true,
--     "answers": {"q1": "option2", "q2": "option1", ...},
--     "result": "traditional",
--     "completedAt": "2025-10-04T12:00:00Z"
--   },
--   "vision": {
--     "priorities": ["faith", "family", "tradition"],
--     "niyyah": "Our intention text...",
--     "journal": "Journal entry..."
--   },
--   "budget": {
--     "totalBudget": 5000000,
--     "categories": {
--       "venue": {"naira": 1000000, "dollars": 0, "notes": "..."},
--       "catering": {"naira": 800000, "dollars": 0, "notes": "..."}
--     }
--   },
--   "vendors": {
--     "photography": [
--       {"name": "Studio A", "contact": "...", "cost": 200000, "status": "booked"}
--     ],
--     "catering": [...]
--   },
--   "timeline": {
--     "weddingDate": "2025-12-15",
--     "tasks": [
--       {"id": 1, "name": "Book venue", "deadline": "2025-11-01", "completed": true}
--     ]
--   },
--   "settings": {
--     "darkMode": false,
--     "lastSection": "budget"
--   }
-- }
-- ============================================

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
-- Grant necessary permissions to authenticated users

-- Grant select on web_app_users
GRANT SELECT, UPDATE ON public.web_app_users TO authenticated;

-- Grant all operations on user_progress (within RLS constraints)
GRANT SELECT, INSERT, UPDATE ON public.user_progress TO authenticated;

-- Grant usage on sequences (if any)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify schema setup:

-- 1. Check tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- 2. Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- 3. Check policies
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- 4. Test insert user
-- INSERT INTO public.web_app_users (email, paystack_reference) 
-- VALUES ('test@example.com', 'test_ref_123') RETURNING *;

-- 5. Test insert progress
-- INSERT INTO public.user_progress (user_id, data)
-- SELECT id, '{"test": true}'::jsonb FROM public.web_app_users WHERE email = 'test@example.com'
-- RETURNING *;

-- ============================================
-- NOTES FOR DEPLOYMENT
-- ============================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify all tables created successfully
-- 3. Test RLS policies with test user
-- 4. Copy Supabase URL and anon key to .env
-- 5. Update Vercel environment variables
-- ============================================
