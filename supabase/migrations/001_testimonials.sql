create table public.forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text unique not null,
  headline text default 'Share your experience',
  prompt text default 'We would love to hear what you think!',
  thank_you_message text default 'Thank you for your feedback!',
  theme_color text default '#000000',
  collect_photo boolean default true,
  collect_rating boolean default true,
  require_consent boolean default false,
  created_at timestamptz default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  form_id uuid,
  author_name text not null,
  author_role text,
  author_company text,
  avatar_url text,
  body_original text not null,
  body_improved text,
  display_body text,
  is_ai_improved boolean default false,
  show_edited_badge boolean default false,
  rating int check (rating >= 1 and rating <= 5),
  status text default 'pending' check (status in ('pending', 'approved', 'hidden')),
  source text default 'form' check (source in ('form', 'csv', 'manual')),
  consent boolean default false,
  created_at timestamptz default now()
);

-- RLS: forms
alter table public.forms enable row level security;

-- Authenticated owners can fully manage their own forms
create policy "Users can select own forms"
  on public.forms for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own forms"
  on public.forms for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own forms"
  on public.forms for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own forms"
  on public.forms for delete
  to authenticated
  using (auth.uid() = user_id);

-- Anonymous visitors can read any form (needed for the public /c/[slug] page)
create policy "Public can read forms"
  on public.forms for select
  to anon
  using (true);

-- RLS: testimonials
alter table public.testimonials enable row level security;

create policy "Users can read own testimonials"
  on public.testimonials for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own testimonials"
  on public.testimonials for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own testimonials"
  on public.testimonials for delete
  to authenticated
  using (auth.uid() = user_id);

-- Anyone (anon or authenticated) can insert a testimonial, but status must be pending
create policy "Public can submit testimonials"
  on public.testimonials for insert
  with check (status = 'pending');
