create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.parts (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Computer', 'Microcontroller', 'Component')),
  name text not null,
  description text not null,
  spec text not null default '',
  image_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  author_name text not null default 'junkdrawer',
  author_id uuid references auth.users (id) on delete set null,
  image_path text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists articles_published_created_idx
  on public.articles (published, created_at desc);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.parts enable row level security;
alter table public.articles enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.parts from anon, authenticated;
revoke all on table public.articles from anon, authenticated;

grant select on table public.profiles to authenticated;
grant select on table public.parts to anon, authenticated;
grant insert, update, delete on table public.parts to authenticated;
grant select on table public.articles to anon, authenticated;
grant insert, update, delete on table public.articles to authenticated;

drop policy if exists "Users read their own profile" on public.profiles;
create policy "Users read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Anyone reads parts" on public.parts;
create policy "Anyone reads parts"
  on public.parts for select to anon, authenticated
  using (true);

drop policy if exists "Admins insert parts" on public.parts;
create policy "Admins insert parts"
  on public.parts for insert to authenticated
  with check ((select private.is_admin()));

drop policy if exists "Admins update parts" on public.parts;
create policy "Admins update parts"
  on public.parts for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "Admins delete parts" on public.parts;
create policy "Admins delete parts"
  on public.parts for delete to authenticated
  using ((select private.is_admin()));

drop policy if exists "Anyone reads published articles" on public.articles;
create policy "Anyone reads published articles"
  on public.articles for select to anon, authenticated
  using (published or (select private.is_admin()));

drop policy if exists "Admins insert articles" on public.articles;
create policy "Admins insert articles"
  on public.articles for insert to authenticated
  with check ((select private.is_admin()));

drop policy if exists "Admins update articles" on public.articles;
create policy "Admins update articles"
  on public.articles for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "Admins delete articles" on public.articles;
create policy "Admins delete articles"
  on public.articles for delete to authenticated
  using ((select private.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-images',
  'content-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "Admins upload content images" on storage.objects;
create policy "Admins upload content images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'content-images' and (select private.is_admin()));

drop policy if exists "Admins update content images" on storage.objects;
create policy "Admins update content images"
  on storage.objects for update to authenticated
  using (bucket_id = 'content-images' and (select private.is_admin()))
  with check (bucket_id = 'content-images' and (select private.is_admin()));

drop policy if exists "Admins delete content images" on storage.objects;
create policy "Admins delete content images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'content-images' and (select private.is_admin()));

-- After creating the admin account in Authentication > Users, promote it with:
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'YOUR_ADMIN_EMAIL');