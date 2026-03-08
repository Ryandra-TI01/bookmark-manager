create extension if not exists "pgcrypto";

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  url text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookmark_tags (
  bookmark_id uuid not null references public.bookmarks (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (bookmark_id, tag_id)
);

create unique index if not exists tags_user_id_name_lower_idx
  on public.tags (user_id, lower(name));

create index if not exists bookmarks_user_id_updated_at_idx
  on public.bookmarks (user_id, updated_at desc);

create or replace function public.set_bookmarks_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_bookmarks_updated_at on public.bookmarks;

create trigger set_bookmarks_updated_at
before update on public.bookmarks
for each row
execute function public.set_bookmarks_updated_at();

alter table public.bookmarks enable row level security;
alter table public.tags enable row level security;
alter table public.bookmark_tags enable row level security;

drop policy if exists "bookmarks_select_own" on public.bookmarks;
create policy "bookmarks_select_own"
on public.bookmarks
for select
using (auth.uid() = user_id);

drop policy if exists "bookmarks_insert_own" on public.bookmarks;
create policy "bookmarks_insert_own"
on public.bookmarks
for insert
with check (auth.uid() = user_id);

drop policy if exists "bookmarks_update_own" on public.bookmarks;
create policy "bookmarks_update_own"
on public.bookmarks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "bookmarks_delete_own" on public.bookmarks;
create policy "bookmarks_delete_own"
on public.bookmarks
for delete
using (auth.uid() = user_id);

drop policy if exists "tags_select_own" on public.tags;
create policy "tags_select_own"
on public.tags
for select
using (auth.uid() = user_id);

drop policy if exists "tags_insert_own" on public.tags;
create policy "tags_insert_own"
on public.tags
for insert
with check (auth.uid() = user_id);

drop policy if exists "tags_update_own" on public.tags;
create policy "tags_update_own"
on public.tags
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "tags_delete_own" on public.tags;
create policy "tags_delete_own"
on public.tags
for delete
using (auth.uid() = user_id);

drop policy if exists "bookmark_tags_select_own" on public.bookmark_tags;
create policy "bookmark_tags_select_own"
on public.bookmark_tags
for select
using (
  exists (
    select 1
    from public.bookmarks
    where public.bookmarks.id = bookmark_id
      and public.bookmarks.user_id = auth.uid()
  )
);

drop policy if exists "bookmark_tags_insert_own" on public.bookmark_tags;
create policy "bookmark_tags_insert_own"
on public.bookmark_tags
for insert
with check (
  exists (
    select 1
    from public.bookmarks
    join public.tags on public.tags.id = tag_id
    where public.bookmarks.id = bookmark_id
      and public.bookmarks.user_id = auth.uid()
      and public.tags.user_id = auth.uid()
  )
);

drop policy if exists "bookmark_tags_delete_own" on public.bookmark_tags;
create policy "bookmark_tags_delete_own"
on public.bookmark_tags
for delete
using (
  exists (
    select 1
    from public.bookmarks
    where public.bookmarks.id = bookmark_id
      and public.bookmarks.user_id = auth.uid()
  )
);
