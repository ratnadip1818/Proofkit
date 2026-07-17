create table public.appsumo_codes (
  code text primary key,
  is_used boolean not null default false,
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz
);

alter table public.appsumo_codes enable row level security;
