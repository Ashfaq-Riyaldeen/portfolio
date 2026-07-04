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
npm run dev     # start at http://localhost:3000
npm run build   # production build
```

Copy `.env.example` to `.env.local` and fill in the Supabase keys. Content is
served from Supabase (with an automatic fallback to the local seed in
`src/lib/content/seed.ts` if the database is unreachable). The database
schema lives in `supabase/schema.sql` — paste it into the Supabase SQL Editor
to set up a fresh project.

## Deploy

Pushed commits deploy automatically via Vercel. Required env vars are listed
in `.env.example`; `RESEND_API_KEY` is optional (email notifications for
contact-form messages).
