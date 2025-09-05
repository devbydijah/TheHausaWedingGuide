-- Complete Supabase setup for Hausa Wedding Guide
-- Run this in Supabase SQL Editor

-- 1. Create sales table
CREATE TABLE IF NOT EXISTS sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    paystack_reference TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    password_hash TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- 3. Create policy for service role access (our API can access all rows)
CREATE POLICY "Service role can manage sales" ON sales
    FOR ALL USING (auth.role() = 'service_role');

-- 4. Create storage bucket for private files (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('private', 'private', false) 
ON CONFLICT (id) DO NOTHING;

-- 5. Create storage policy for service role
CREATE POLICY "Service role can access private files" ON storage.objects
    FOR ALL USING (bucket_id = 'private' AND auth.role() = 'service_role');

-- 6. Create index for performance
CREATE INDEX IF NOT EXISTS sales_paystack_reference_idx ON sales(paystack_reference);
CREATE INDEX IF NOT EXISTS sales_email_idx ON sales(email);
