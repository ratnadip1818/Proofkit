-- Add missing subscription columns to profiles table
alter table public.profiles
  add column if not exists plan_tier text not null default 'free',
  add column if not exists paddle_subscription_id text,
  add column if not exists subscription_status text;
