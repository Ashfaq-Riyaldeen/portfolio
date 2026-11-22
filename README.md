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
to set up a fresh project, then follow [the admin repair guide](supabase/ADMIN_REPAIR.md)
to load the current content and section controls.

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
The current portrait is packaged unchanged under a content-hashed filename; the
migration sets that photo for both the public site and the admin profile. Private source files and local content backups
are ignored by Git.

### Apply to the existing site

Follow [supabase/ADMIN_REPAIR.md](supabase/ADMIN_REPAIR.md). Run the complete
`supabase/repair-admin-20261122.sql` file in your project's SQL Editor. It combines
the missing schema, authenticated section-save function, and latest content update
inside one transaction. It captures a private database-side content snapshot before
editing records and preserves accounts, messages, uploads, and unrelated drafts.

The repair includes the three current highlights: 20+ Projects & Research,
3.77/4.0 CGPA, and 1+ years Experience. Repeating the repair skips content updates,
protecting subsequent admin edits. Its companion rollback refuses to overwrite
changes made after the repair.

Use `npm run admin:prepare` to regenerate the repair package locally; it never
connects to Supabase. The older `content:prepare` workflow and November 21 migrations
are historical and should not be reapplied after this repair.

The existing Vercel deployment uses `npm run build`. Keep
`PORTFOLIO_CONTENT_SOURCE` unset there. Public reads revalidate every 60 seconds;
admin saves invalidate the shared content cache and public layout immediately.
The public key in `.env.local` cannot apply schema migrations; the repair must run
through authenticated Supabase SQL access.

### Admin and presentation checks

`npm run test:admin` exercises actual server actions with isolated database/framework
boundaries, including signed-out access, decimal values, failed writes, cache
invalidation, and fallback status. It also renders project cards and detail pages
to check image addition/removal and uniform cards. It performs no live writes.

Footer links and homepage sections share visibility, order, and content-availability
rules. Empty sections stay out of navigation until content is added. Project cover
and gallery uploads appear only on detail pages; no media means no reserved image
area. Existing video demos remain supported.

Highlights use equal-height cards without individual scroll offsets. Skills use
responsive category cards and skill chips; category ordering remains editable in
admin. Legacy skill icon/level data is preserved but not displayed as percentages.

## Deploy

Pushed commits deploy automatically via Vercel. Required env vars are listed
in `.env.example`; `RESEND_API_KEY` is optional (email notifications for
contact-form messages).
