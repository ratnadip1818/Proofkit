-- Add tags column to public.testimonials to support interactive filtering
alter table public.testimonials
  add column if not exists tags text[] not null default '{}';
