alter table public.testimonials
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_testimonials_updated_at on public.testimonials;

create trigger set_testimonials_updated_at
  before update on public.testimonials
  for each row execute procedure public.set_updated_at();
