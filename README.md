# Ashfaq Riyaldeen — Portfolio

Elite dark-futuristic portfolio with a private admin panel: every section's content (projects, certificates, YouTube demos, GitHub links, resume) is editable live, and any section can be shown/hidden without touching code.

## Docs

- **[OWNERS_GUIDE.md](./OWNERS_GUIDE.md)** — how to run the site day to day (edit content, read messages, deploy)
- **[PROJECT_SPEC.md](./PROJECT_SPEC.md)** — full specification: architecture, sections, design system, data model
- **[TASKS.md](./TASKS.md)** — task breakdown with live progress (what's done / what's next)

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion + Lenis · Supabase (Postgres/Auth/Storage) · Vercel

## Develop

```bash
npm ci          # install locked dependencies
npm run dev     # start at http://localhost:3000
npm run build   # production build
```

Copy `.env.example` to `.env.local` and fill in the Supabase keys. Content is
served from Supabase (with an automatic fallback to the local seed in
`src/lib/content/seed.ts` if the database is unreachable). The database
schema lives in `supabase/schema.sql` — paste it into the Supabase SQL Editor
to set up a fresh project, then apply
`supabase/migrations/20261121_refresh_portfolio.sql` for the curated content.

## November 2026 content refresh

`src/lib/content/seed.ts` is the curated snapshot of the supplied records: 20
projects, six featured projects, three experience entries, six certifications,
and two finalist recognitions. Supabase remains the normal editable content source.
Until the database has the new `projects.categories` column, reads fall back to
the complete refreshed snapshot. The admin panel displays a migration notice.
Applying the transactional migration enables live content editing again.

To review the new content before updating the database:

```bash
npm run dev:content     # snapshot preview at localhost:3000
npm run test:content    # content, search, date and asset checks
npm run test:preview    # read-only HTTP checks; requires the preview running
npm run build:content  # production build using the snapshot
```

Snapshot preview intentionally ignores database content edits. Admin actions still
target the configured Supabase project; use normal `npm run dev` after the migration
to check admin edits. Keep `PORTFOLIO_CONTENT_SOURCE` unset in Vercel.

The unchanged supplied CV is packaged at `/documents/Ashfaq_Riyaldeen_CV.pdf`.
The existing portrait is copied locally for fallback rendering; the migration keeps
the current database portrait URL. Private source files and local content backups
are ignored by Git.

### Apply to the existing site

1. Retain a current backup of the affected public content tables. The preparation
   backup is `.portfolio-backups/content-before-2026-11-21.json`; its companion
   rollback is `.portfolio-backups/rollback-content-2026-11-21.sql`.
2. Deploy this code to the existing Vercel project using the normal `npm run build`
   command. This publishes the refreshed snapshot while migration is pending and
   makes the new routes and packaged CV available. Ensure the
   production `NEXT_PUBLIC_SITE_URL` uses the live domain and the preview override
   is unset.
3. Apply `supabase/migrations/20261121_refresh_portfolio.sql` using authenticated
   Supabase SQL access. It runs in one transaction, adds project categories and
   experience types, updates known records, unpublishes sample projects/posts, and
   removes the identified sample awards, paper, and outdated counts. Messages,
   users, uploads, and unrelated content are preserved. Sample testimonials stay
   stored but their section is hidden.
4. Redeploy the same code with a fresh build cache to regenerate the new project
   routes, sitemap, and home content. Confirm `/`, `/projects`, all real project
   routes, CV download, and the admin panel. Retired sample URLs should return 404.
   Normal content reads revalidate every 60 seconds; admin saves invalidate the
   public layout and its nested pages.

`npm run content:prepare` regenerates the SQL from the snapshot and the local
pre-update backup, without connecting to the database. An alternative backup path
may be passed directly to the script. Rerunning the migration restores this curated
revision and can overwrite subsequent admin edits; review before reapplying.

For rollback, apply the local rollback SQL and redeploy the previous Vercel version.
The rollback restores the captured content while retaining the compatible additive
schema. The migration was checked on an isolated PostgreSQL engine against the
pre-update data, a repeated run, an exact content rollback, and an empty database.

Live application requires authenticated Supabase and deployment access; the public
Supabase key in `.env.local` does not grant schema or administrative write access.

## Deploy

Pushed commits deploy automatically via Vercel. Required env vars are listed
in `.env.example`; `RESEND_API_KEY` is optional (email notifications for
contact-form messages).
