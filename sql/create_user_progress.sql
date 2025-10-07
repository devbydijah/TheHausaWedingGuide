-- Supabase: user progress table (one row per email+token)
create extension if not exists pgcrypto;

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(email, token)
);

-- Optional RLS (keep off if only server uses service role)
-- alter table public.user_progress enable row level security;
