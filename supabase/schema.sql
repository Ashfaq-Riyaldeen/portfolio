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
  type text not null default 'work' check (type in ('work','internship')),
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

-- ── 4 · Starter content ─────────────────────────────────────────
-- The same placeholders the site ships with — edit everything in /admin.
-- Each block only inserts if the table is still empty.

insert into public.profile
  (id, name, roles, tagline, bio, quick_facts, currently_learning, email, location, socials)
values (
  1,
  'Ashfaq Riyaldeen',
  array['Full-Stack Developer','Software Engineer','AI / ML Enthusiast'],
  'Computer Engineering undergraduate crafting fast, elegant web experiences — and teaching machines a trick or two along the way.',
  '<p>I''m a Computer Engineering undergraduate at the University of Ruhuna who loves turning ideas into polished, production-ready software. My happy place is the full stack — designing clean interfaces, wiring them to robust APIs, and shipping.</p><p>Lately I''ve been exploring machine learning and data science: building small models, breaking them, and understanding why. I care about writing code that''s fast, readable, and a little bit delightful.</p>',
  '[{"label":"Degree","value":"BSc Eng (Hons) Computer Engineering"},{"label":"University","value":"University of Ruhuna"},{"label":"Focus","value":"Full-Stack · AI/ML"},{"label":"Status","value":"Open to internships"}]'::jsonb,
  array['Next.js','TensorFlow','System Design'],
  'nanoxjune@gmail.com',
  'Sri Lanka',
  '[{"platform":"GitHub","url":"https://github.com/Ashfaq-Riyaldeen"},{"platform":"LinkedIn","url":"https://www.linkedin.com/in/ashfaq-riyaldeen/"}]'::jsonb
)
on conflict (id) do nothing;

insert into public.site_settings (id, site_title, meta_description, accent_color)
values (
  1,
  'Ashfaq Riyaldeen — Full-Stack Developer',
  'Portfolio of Ashfaq Riyaldeen — Computer Engineering undergraduate at the University of Ruhuna, full-stack developer, and AI/ML enthusiast.',
  '#7c3aed'
)
on conflict (id) do nothing;

insert into public.sections (key, title, nav_label, visible, sort_order) values
  ('hero',            'Home',                      'Home',           true,  1),
  ('about',           'About Me',                  'About',          true,  2),
  ('stats',           'Highlights',                'Highlights',     true,  3),
  ('resume',          'Resume / CV',               'Resume',         true,  4),
  ('education',       'Education',                 'Education',      true,  5),
  ('skills',          'Technical Skills',          'Skills',         true,  6),
  ('projects',        'Projects',                  'Projects',       true,  7),
  ('publications',    'Research & Publications',   'Research',       true,  8),
  ('experience',      'Experience',                'Experience',     true,  9),
  ('certifications',  'Certifications',            'Certifications', true,  10),
  ('achievements',    'Achievements & Awards',     'Achievements',   true,  11),
  ('coding-profiles', 'GitHub & Coding Profiles',  'Profiles',       true,  12),
  ('blogs',           'Technical Blogs',           'Blog',           true,  13),
  ('testimonials',    'Testimonials',              'Testimonials',   true,  14),
  ('volunteering',    'Volunteering & Leadership', 'Volunteering',   false, 15),
  ('gallery',         'Gallery',                   'Gallery',        false, 16),
  ('languages',       'Languages',                 'Languages',      false, 17),
  ('services',        'Services',                  'Services',       false, 18),
  ('faq',             'FAQ',                       'FAQ',            false, 19),
  ('contact',         'Contact',                   'Contact',        true,  20)
on conflict (key) do nothing;

insert into public.stats (label, value, suffix, sort_order)
select * from (values
  ('Projects Built', 12, '+', 1),
  ('Certifications', 8,  '',  2),
  ('Hackathons',     5,  '',  3),
  ('GitHub Repos',   24, '+', 4)
) as v(label, value, suffix, sort_order)
where not exists (select 1 from public.stats);

insert into public.education
  (institution, degree, field, start_date, end_date, grade, highlights, sort_order)
select * from (values
  ('University of Ruhuna', 'BSc Eng (Hons)', 'Computer Engineering', '2023-09', null::text, 'GPA 3.8 / 4.0',
   array['Dean''s List — 3 consecutive semesters','Member of the Computer Science Society','Coursework: Data Structures, Algorithms, Databases, Machine Learning'], 1),
  ('Your College', 'G.C.E. Advanced Level', 'Physical Science Stream', '2020-01', '2022-12', '3 A passes',
   array['School prefect','Founder of the ICT club'], 2)
) as v(institution, degree, field, start_date, end_date, grade, highlights, sort_order)
where not exists (select 1 from public.education);

insert into public.skill_categories (name, skills, sort_order)
select * from (values
  ('Languages', '[{"name":"TypeScript","icon":null,"level":90},{"name":"Python","icon":null,"level":85},{"name":"Java","icon":null,"level":75},{"name":"C++","icon":null,"level":70},{"name":"SQL","icon":null,"level":80}]'::jsonb, 1),
  ('Frontend',  '[{"name":"React","icon":null,"level":90},{"name":"Next.js","icon":null,"level":88},{"name":"Tailwind CSS","icon":null,"level":92},{"name":"Framer Motion","icon":null,"level":80}]'::jsonb, 2),
  ('Backend',   '[{"name":"Node.js","icon":null,"level":85},{"name":"Express","icon":null,"level":80},{"name":"PostgreSQL","icon":null,"level":78},{"name":"Supabase","icon":null,"level":82},{"name":"REST APIs","icon":null,"level":88}]'::jsonb, 3),
  ('AI / ML',   '[{"name":"TensorFlow","icon":null,"level":65},{"name":"scikit-learn","icon":null,"level":72},{"name":"Pandas","icon":null,"level":78},{"name":"NumPy","icon":null,"level":78}]'::jsonb, 4),
  ('Tools',     '[{"name":"Git & GitHub","icon":null,"level":90},{"name":"Docker","icon":null,"level":65},{"name":"Linux","icon":null,"level":75},{"name":"Figma","icon":null,"level":70},{"name":"VS Code","icon":null,"level":95}]'::jsonb, 5)
) as v(name, skills, sort_order)
where not exists (select 1 from public.skill_categories);

insert into public.projects
  (slug, title, summary, description, tech, github_url, featured, published, sort_order)
values
  ('nova-ai-study-assistant', 'Nova — AI Study Assistant',
   'An AI-powered study companion that turns lecture notes into flashcards, quizzes, and spaced-repetition schedules.',
   '<p>Nova ingests lecture notes (PDF or text) and uses an LLM pipeline to generate flashcards, practice quizzes, and a personalised spaced-repetition schedule. Built with a Next.js frontend, a Python FastAPI service for the ML pipeline, and Supabase for auth and storage.</p><p>Highlights include streaming AI responses, offline-first flashcard review, and a study-streak system that kept beta testers coming back daily.</p>',
   array['Next.js','TypeScript','FastAPI','OpenAI','Supabase'],
   'https://github.com/your-username/nova', true, true, 1),
  ('pulse-realtime-chat', 'Pulse — Realtime Chat',
   'A blazing-fast realtime chat app with rooms, typing indicators, and read receipts — WebSockets end to end.',
   '<p>Pulse is a realtime chat application supporting rooms, presence, typing indicators, and read receipts. The backend is Node.js with Socket.IO and Redis pub/sub for horizontal scaling; the frontend is React with optimistic UI updates.</p><p>Load-tested to 5,000 concurrent connections on a single node.</p>',
   array['React','Node.js','Socket.IO','Redis','MongoDB'],
   'https://github.com/your-username/pulse', true, true, 2),
  ('trackr-expense-tracker', 'Trackr — Smart Expense Tracker',
   'A mobile-first expense tracker with ML-powered category prediction and beautiful spending insights.',
   '<p>Trackr makes logging expenses effortless: type "coffee 450" and the ML model predicts the category. Monthly insights are rendered as animated charts, and budgets send gentle nudges before you overspend.</p>',
   array['React Native','Expo','scikit-learn','Supabase'],
   'https://github.com/your-username/trackr', false, true, 3)
on conflict (slug) do nothing;

insert into public.publications
  (title, authors, venue, year, abstract, type, sort_order)
select * from (values
  ('A Lightweight CNN Approach to Handwritten Character Recognition on Low-Power Devices',
   array['Ashfaq Riyaldeen','Co-Author Name'],
   'Undergraduate Research Symposium', 2026,
   'We present a compact convolutional architecture achieving 97.2% accuracy on handwritten character recognition while running in under 40ms on commodity mobile hardware — a placeholder abstract you can replace from the admin panel.',
   'conference', 1)
) as v(title, authors, venue, year, abstract, type, sort_order)
where not exists (select 1 from public.publications);

insert into public.experience
  (company, role, type, location, start_date, end_date, bullets, sort_order)
select * from (values
  ('Acme Software', 'Software Engineering Intern', 'internship', 'Remote', '2025-06', '2025-09',
   array['Built and shipped a customer-facing dashboard feature used by 2,000+ users','Cut API response times 40% by adding query-level caching','Wrote integration tests that caught 3 regressions before release'], 1)
) as v(company, role, type, location, start_date, end_date, bullets, sort_order)
where not exists (select 1 from public.experience);

insert into public.certifications
  (title, issuer, issue_date, credential_id, credential_url, skills, sort_order)
select * from (values
  ('Machine Learning Specialization', 'Coursera · DeepLearning.AI', '2025-11', 'ABC123XYZ',
   'https://coursera.org/verify/ABC123XYZ', array['Python','TensorFlow','Supervised Learning'], 1),
  ('Meta Front-End Developer Professional Certificate', 'Coursera · Meta', '2025-05', 'DEF456UVW',
   'https://coursera.org/verify/DEF456UVW', array['React','JavaScript','UI/UX'], 2),
  ('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2026-01', 'GHI789RST',
   'https://aws.amazon.com/verification', array['Cloud','AWS'], 3)
) as v(title, issuer, issue_date, credential_id, credential_url, skills, sort_order)
where not exists (select 1 from public.certifications);

insert into public.achievements
  (title, description, date, issuer, category, sort_order)
select * from (values
  ('Winner — University Hackathon 2025',
   'Led a team of four to first place among 42 teams with an accessibility-focused campus navigation app.',
   '2025-10', 'Your University', 'hackathon', 1),
  ('Dean''s List',
   'Recognised for academic excellence — three consecutive semesters.',
   '2025-06', 'Faculty of Computing', 'award', 2)
) as v(title, description, date, issuer, category, sort_order)
where not exists (select 1 from public.achievements);

insert into public.coding_profiles (platform, username, url, sort_order)
select * from (values
  ('GitHub',     'Ashfaq-Riyaldeen', 'https://github.com/Ashfaq-Riyaldeen', 1),
  ('LeetCode',   'your-username', 'https://leetcode.com/your-username',   2),
  ('HackerRank', 'your-username', 'https://hackerrank.com/your-username', 3)
) as v(platform, username, url, sort_order)
where not exists (select 1 from public.coding_profiles);

insert into public.blog_posts
  (slug, title, excerpt, content, tags, published, published_at)
values
  ('understanding-react-server-components',
   'Understanding React Server Components (Without the Jargon)',
   'Server components confused me for months — here''s the mental model that finally made them click.',
   '<p>This is a placeholder post. Write your real posts in the admin panel''s editor — or link out to Medium/Dev.to instead.</p>',
   array['React','Next.js'], true, '2026-05-14'),
  ('my-first-ml-model-mistakes',
   '5 Mistakes I Made Training My First ML Model',
   'Overfitting, data leakage, and other rites of passage — what I''d tell myself before starting.',
   '<p>This is a placeholder post — replace it from the admin panel.</p>',
   array['Machine Learning','Python'], true, '2026-03-02')
on conflict (slug) do nothing;

insert into public.testimonials (name, role, company, quote, sort_order)
select * from (values
  ('Dr. Jane Perera', 'Senior Lecturer', 'Your University',
   'Ashfaq consistently goes beyond the brief — he doesn''t just complete assignments, he ships polished products. One of the most driven students I''ve supervised.', 1),
  ('Kasun Silva', 'Engineering Lead', 'Acme Software',
   'During his internship, Ashfaq delivered features we''d normally assign to mid-level engineers. His code was clean, tested, and on time — every time.', 2)
) as v(name, role, company, quote, sort_order)
where not exists (select 1 from public.testimonials);

insert into public.volunteering (organization, role, start_date, end_date, description, sort_order)
select * from (values
  ('CS Society', 'Events Coordinator', '2024-09', null::text,
   'Organising workshops and the annual inter-university hackathon; grew workshop attendance from 30 to 120+ students.', 1)
) as v(organization, role, start_date, end_date, description, sort_order)
where not exists (select 1 from public.volunteering);

insert into public.languages (name, proficiency, sort_order)
select * from (values
  ('English', 'Fluent',         1),
  ('Tamil',   'Native',         2),
  ('Sinhala', 'Conversational', 3)
) as v(name, proficiency, sort_order)
where not exists (select 1 from public.languages);

insert into public.services (title, description, sort_order)
select * from (values
  ('Web Development', 'Modern, fast websites and web apps built with Next.js.', 1)
) as v(title, description, sort_order)
where not exists (select 1 from public.services);

insert into public.faqs (question, answer, sort_order)
select * from (values
  ('Are you open to internships?',
   'Yes — I''m actively looking for software engineering internships. Reach out via the contact form below.', 1)
) as v(question, answer, sort_order)
where not exists (select 1 from public.faqs);
