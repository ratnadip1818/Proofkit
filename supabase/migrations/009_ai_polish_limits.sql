-- Add AI limit tracking columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ai_credits_used INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_credits_reset_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) + interval '30 days';
