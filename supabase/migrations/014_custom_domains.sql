-- Add custom_domain column to forms table for white-labeling
alter table public.forms
  add column if not exists custom_domain text unique default null;
