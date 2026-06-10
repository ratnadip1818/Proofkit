alter table public.profiles
  add column if not exists is_lifetime boolean not null default false;
