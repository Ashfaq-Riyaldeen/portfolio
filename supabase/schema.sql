-- ════════════════════════════════════════════════════════════════
-- Portfolio — database schema, security rules & starter content
-- ════════════════════════════════════════════════════════════════
-- HOW TO RUN (one time, ~30 seconds):
--   1. Supabase Dashboard → your project → SQL Editor → New query
--   2. Paste this ENTIRE file and press "Run"
--   3. You should see "Success. No rows returned"
-- Safe to re-run: existing tables and content are left untouched.
-- ════════════════════════════════════════════════════════════════

-- ── 1 · Tables ──────────────────────────────────────────────────

create table if not exists public.profile (
  id integer primary key default 1 check (id = 1),  -- single-row table
  name text not null default '',
  roles text[] not null default '{}',
  tagline text not null default '',
  bio text not null default '',
  quick_facts jsonb not null default '[]',
  currently_learning text[] not null default '{}',
  avatar_url text,
  resume_url text,
  email text not null default '',
  location text not null default '',
  socials jsonb not null default '[]'
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),  -- single-row table
  site_title text not null default '',
  meta_description text not null default '',
  og_image_url text,
  accent_color text not null default '#7c3aed'
);

create table if not exists public.sections (
  key text primary key,
  title text not null,
  nav_label text not null,
  visible boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value integer not null default 0,
  suffix text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null default '',
  field text not null default '',
  start_date text not null default '',  -- "YYYY-MM"
  end_date text,                        -- null = present
  grade text,
  logo_url text,
  highlights text[] not null default '{}',
  sort_order integer not null default 0
);

create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  skills jsonb not null default '[]',   -- [{ name, icon, level }]
  sort_order integer not null default 0
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null default '',  -- rich text (HTML)
  cover_url text,
  gallery text[] not null default '{}',
  tech text[] not null default '{}',
  categories text[] not null default '{}',
  youtube_url text,
  github_url text,
  live_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text[] not null default '{}',
  venue text not null default '',
  year integer not null,
  abstract text not null default '',
  link text,
  pdf_url text,
  type text not null default 'other'
    check (type in ('journal','conference','preprint','thesis','other')),
  sort_order integer not null default 0
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  type text not null default 'work' check (type in ('work','internship','part-time','university-project')),
  location text not null default '',
  start_date text not null default '',
  end_date text,
  bullets text[] not null default '{}',
  logo_url text,
  sort_order integer not null default 0
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  issue_date text not null default '',
  credential_id text,
  credential_url text,
  file_url text,
  skills text[] not null default '{}',
  sort_order integer not null default 0
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  date text not null default '',
  issuer text,
  image_url text,
  category text not null default 'other'
    check (category in ('award','hackathon','competition','scholarship','other')),
  sort_order integer not null default 0
);

create table if not exists public.coding_profiles (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  username text not null default '',
  url text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text,          -- rich text (HTML); null when the post is external
  external_url text,     -- set when the post lives on Medium/Dev.to/etc.
  cover_url text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at text not null default '',  -- "YYYY-MM-DD"
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  company text,
  avatar_url text,
  quote text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.volunteering (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  role text not null default '',
  start_date text not null default '',
  end_date text,
  description text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order integer not null default 0
);

create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  proficiency text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text,
  sort_order integer not null default 0
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── 2 · Row Level Security ──────────────────────────────────────
-- Anyone may READ public content; only the signed-in admin may WRITE.

do $$
declare t text;
begin
  foreach t in array array[
    'profile','site_settings','sections','stats','education',
    'skill_categories','publications','experience','certifications',
    'achievements','coding_profiles','testimonials','volunteering',
    'gallery','languages','services','faqs'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public read" on public.%I', t);
    execute format('create policy "Public read" on public.%I for select using (true)', t);
    execute format('drop policy if exists "Admin write" on public.%I', t);
    execute format('create policy "Admin write" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Drafts stay hidden: visitors only see published projects/posts.
alter table public.projects enable row level security;
drop policy if exists "Public read published" on public.projects;
create policy "Public read published" on public.projects
  for select to anon using (published);
drop policy if exists "Admin full access" on public.projects;
create policy "Admin full access" on public.projects
  for all to authenticated using (true) with check (true);

alter table public.blog_posts enable row level security;
drop policy if exists "Public read published" on public.blog_posts;
create policy "Public read published" on public.blog_posts
  for select to anon using (published);
drop policy if exists "Admin full access" on public.blog_posts;
create policy "Admin full access" on public.blog_posts
  for all to authenticated using (true) with check (true);

-- Messages: anyone can SEND, only the admin can read/manage.
alter table public.messages enable row level security;
drop policy if exists "Anyone can send" on public.messages;
create policy "Anyone can send" on public.messages
  for insert to anon, authenticated with check (true);
drop policy if exists "Admin manage" on public.messages;
create policy "Admin manage" on public.messages
  for all to authenticated using (true) with check (true);

-- ── 3 · Storage buckets (images + PDFs) ─────────────────────────

insert into storage.buckets (id, name, public)
  values ('media', 'media', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('documents', 'documents', true) on conflict (id) do nothing;

drop policy if exists "Public read portfolio files" on storage.objects;
create policy "Public read portfolio files" on storage.objects
  for select using (bucket_id in ('media','documents'));
drop policy if exists "Admin upload portfolio files" on storage.objects;
create policy "Admin upload portfolio files" on storage.objects
  for insert to authenticated with check (bucket_id in ('media','documents'));
drop policy if exists "Admin update portfolio files" on storage.objects;
create policy "Admin update portfolio files" on storage.objects
  for update to authenticated using (bucket_id in ('media','documents'));
drop policy if exists "Admin delete portfolio files" on storage.objects;
create policy "Admin delete portfolio files" on storage.objects
  for delete to authenticated using (bucket_id in ('media','documents'));


-- Content is maintained in src/lib/content/seed.ts.
-- After this schema, apply migrations/20261121_refresh_portfolio.sql.
-- No fictional starter records are inserted.
