-- ════════════════════════════════════════════════════════════════
-- Fill the live database with Ashfaq's REAL details, taken from his
-- LinkedIn profile export + GitHub (2026-07-04).
-- Replaces the earlier update-real-info.sql — safe to run either way.
-- Run once: Supabase Dashboard → SQL Editor → New query → paste → Run
-- ════════════════════════════════════════════════════════════════

-- ── Profile ─────────────────────────────────────────────────────

update public.profile set
  tagline = 'Computer Engineering undergraduate at the University of Ruhuna, building scalable and efficient systems across software engineering, DevOps, and AI/ML.',
  bio = '<p>I''m a Computer Engineering undergraduate at the University of Ruhuna with a strong foundation in software engineering, DevOps, and AI/ML. I aim to build scalable, efficient systems that drive innovation — combining technical expertise with leadership experience to make a meaningful impact in software development and artificial intelligence.</p><p>Beyond academics, I''m an active member of the IESL Ruhuna Engineering Students'' Chapter, and as treasurer of the Akurana Undergraduates and Young Graduates Association I managed finances and organised community-service initiatives.</p>',
  quick_facts = '[{"label":"Degree","value":"BSc in Computer Engineering"},{"label":"University","value":"University of Ruhuna"},{"label":"Focus","value":"Full-Stack · DevOps · AI/ML"},{"label":"Status","value":"Open to opportunities"}]'::jsonb,
  email = 'ashfaqriyaldeen@gmail.com',
  location = 'Kandy, Sri Lanka',
  socials = '[{"platform":"GitHub","url":"https://github.com/Ashfaq-Riyaldeen"},{"platform":"LinkedIn","url":"https://www.linkedin.com/in/ashfaqriyaldeen/"}]'::jsonb
where id = 1;

update public.site_settings set
  meta_description = 'Portfolio of Ashfaq Riyaldeen — Computer Engineering undergraduate at the University of Ruhuna, full-stack developer, and AI/ML enthusiast.'
where id = 1;

-- ── Stats (honest numbers; edit anytime in /admin later) ────────

delete from public.stats;
insert into public.stats (label, value, suffix, sort_order) values
  ('GitHub Repos',    35, '', 1),
  ('Certifications',  5,  '', 2),
  ('Internships',     1,  '', 3),
  ('Languages Spoken', 3, '', 4);

-- ── Education (from LinkedIn) ───────────────────────────────────

delete from public.education;
insert into public.education
  (institution, degree, field, start_date, end_date, highlights, sort_order)
values
  ('University of Ruhuna', 'BSc', 'Computer Engineering', '2022-02', null,
   array['Faculty of Engineering','Member of the IESL — Ruhuna Engineering Students'' Chapter'], 1),
  ('Azhar College Akurana', 'G.C.E. Advanced Level', 'Physical Science', '2018-03', '2020-10',
   array['Student''s Prefect — completed two prefect training programmes'], 2),
  ('Institute of English, Sri Lanka', 'Diploma of Education', 'English', '2018-01', '2018-07',
   '{}'::text[], 3);

-- ── Experience (from LinkedIn) ──────────────────────────────────

delete from public.experience;
insert into public.experience
  (company, role, type, location, start_date, end_date, bullets, sort_order)
values
  ('paralegal.lk', 'Software Engineer Intern', 'internship', 'Colombo, Sri Lanka',
   '2025-05', '2025-11', '{}'::text[], 1);

-- ── Certifications (titles from LinkedIn; add issuers/dates/files in /admin) ──

delete from public.certifications;
insert into public.certifications (title, issuer, issue_date, skills, sort_order) values
  ('Python and Machine Learning', '', '', array['Python','Machine Learning'], 1),
  ('Data Science Masterclass',    '', '', array['Data Science','Python'],     2),
  ('Python for Beginners',        '', '', array['Python'],                    3),
  ('Git and Github',              '', '', array['Git','GitHub'],              4),
  ('GIT for Beginners',           '', '', array['Git','Version Control'],     5);

-- ── Volunteering & leadership (from LinkedIn) ───────────────────

delete from public.volunteering;
insert into public.volunteering
  (organization, role, start_date, end_date, description, sort_order)
values
  ('IESL — Ruhuna Engineering Students'' Chapter', 'Student Member', '2024-04', null,
   'Taking part in technical projects and events run by the Institution of Engineers Sri Lanka student chapter.', 1),
  ('Akurana Undergraduates and Young Graduates Association', 'Treasurer', '2022-08', '2025-08',
   'Managed the association''s finances and organised community-service initiatives.', 2),
  ('Azhar College Akurana', 'Student''s Prefect', '2018-11', '2020-10',
   'Maintained discipline, supported teachers and students, and organised school events; completed two prefect training programmes.', 3);

-- ── Languages (from LinkedIn) ───────────────────────────────────

delete from public.languages;
insert into public.languages (name, proficiency, sort_order) values
  ('Tamil',     'Native / bilingual',   1),
  ('English',   'Professional working', 2),
  ('Sinhalese', 'Professional working', 3);

-- ── Coding profiles: keep GitHub real, drop fake placeholders ───

update public.coding_profiles set
  username = 'Ashfaq-Riyaldeen',
  url = 'https://github.com/Ashfaq-Riyaldeen'
where platform = 'GitHub';

delete from public.coding_profiles where username = 'your-username';
