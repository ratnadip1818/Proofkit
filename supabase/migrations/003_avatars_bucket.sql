-- Create public avatars bucket for testimonial photos
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public read access
create policy "Avatars are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Anyone can upload (collection form submitters are unauthenticated)
create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars');
