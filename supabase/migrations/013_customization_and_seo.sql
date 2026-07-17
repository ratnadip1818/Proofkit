-- Add custom CSS and custom Google Font columns to forms table
alter table public.forms
  add column if not exists custom_css text default null,
  add column if not exists custom_font text default 'Inter';
