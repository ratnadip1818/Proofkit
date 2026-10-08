-- Migration 015: Allow additional platforms in testimonials.source check constraint
ALTER TABLE public.testimonials DROP CONSTRAINT IF EXISTS testimonials_source_check;

ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_source_check 
  CHECK (source IN ('form', 'csv', 'manual', 'twitter', 'producthunt', 'appstore', 'youtube', 'google', 'linkedin', 'trustpilot', 'reddit'));
