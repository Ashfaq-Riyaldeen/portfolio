# Portfolio Website — Project Specification

> **Status:** Approved — build in progress (Phase 1 started 2026-07-03)
> **Date:** 2026-07-03
> **Owner:** Ashfaq Riyaldeen (Computer Engineering undergraduate, University of Ruhuna)
> **Working directory:** `C:\Users\A S H F A K\Desktop\portfolio`

---

## 1. Vision

A personal portfolio website with an **elite, dark-futuristic, animation-rich design** that stands out from template portfolios. Every piece of content — projects, certificates, education, links, even which sections appear on the page — is managed **live through a private admin panel**, with zero code changes needed after launch. Built once, updated forever from any browser.

---

## 2. Locked Decisions

| Decision | Choice | Why |
|---|---|---|
| Content editing | **Custom admin panel** at `/admin` | Full control, one codebase, matches site design, no third-party CMS |
| Backend | **Supabase** (free tier) | Postgres database + auth + file storage in one free service |
| Hosting | **Vercel** (free Hobby tier) | Best-in-class Next.js hosting, auto-deploy from GitHub, $0 |
| Design direction | **Dark futuristic** | Deep-dark base, glowing gradients, particles, scroll animations |
| Audience emphasis | **Student profile** | Education, skills, projects, internships, certifications up front |
| Total running cost | **$0/month** | All free tiers; custom domain optional later (~$10/yr) |

---

## 3. Core Requirements

1. **Elite animated UI** — premium dark design with smooth, tasteful motion everywhere (details in §10–11).
2. **Fully dynamic content** — every section's content lives in the database and is editable live from the admin panel: text, images, YouTube video links, GitHub links, certificates (image or PDF), resume PDF, social links.
3. **Section visibility toggles** — every section can be switched visible/invisible from the admin panel; the navbar and page update automatically. Section order is also re-arrangeable.
4. **Media support** — image uploads (projects, certificates, logos, avatars), PDF uploads (resume, certificates, papers), embedded YouTube players, external links.
5. **Responsive** — flawless on mobile, tablet, and desktop.
6. **Fast & SEO-friendly** — server-rendered, optimized images, meta tags editable from admin.

---

## 4. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) + React 19 + TypeScript | Server components, server actions |
| Styling | **Tailwind CSS v4** | Design tokens for the dark theme |
| UI primitives (admin) | **shadcn/ui** | Polished forms, tables, dialogs for the admin panel |
| Animation | **Motion (Framer Motion)** + **Lenis** smooth scroll | Scroll reveals, page transitions, micro-interactions |
| Database | **Supabase Postgres** | All content tables |
| Auth | **Supabase Auth** | Single admin account (email + password) |
| File storage | **Supabase Storage** | Images + PDFs, public-read buckets |
| Forms & validation | React Hook Form + Zod | Admin forms and the public contact form |
| Rich text | **Tiptap** editor | For About text, project descriptions, blog posts |
| Video embeds | Lite YouTube embed | Fast-loading YouTube players |
| Email (optional) | Resend free tier | Notify you when someone submits the contact form |
| Hosting | **Vercel** | Auto-deploys from GitHub `main` branch |

**Content freshness:** public pages are cached for speed; every admin save triggers on-demand revalidation, so changes appear on the live site **instantly**.

---

## 5. Architecture Overview

```
┌────────────────────────── Vercel (free) ──────────────────────────┐
│  Next.js app                                                      │
│  ├─ Public site  /            (server-rendered, cached, animated) │
│  ├─ Project pages /projects/[slug]                                │
│  ├─ Blog pages    /blog/[slug]                                    │
│  └─ Admin panel  /admin/*     (login-protected, middleware guard) │
└──────────────┬────────────────────────────────────────────────────┘
               │  @supabase/ssr (server-side queries + auth)
┌──────────────▼───────────── Supabase (free) ──────────────────────┐
│  Postgres: content tables (RLS: public read / admin-only write)   │
│  Auth: single admin user                                          │
│  Storage: `media` bucket (images) + `documents` bucket (PDFs)     │
└───────────────────────────────────────────────────────────────────┘
```

---

## 6. Site Map & Sections

The public site is a **single scrolling page** of sections (plus detail pages for projects and blog posts). Every section below can be **shown/hidden and re-ordered** from the admin panel. The navbar builds itself from visible sections only.

### 6.1 Your requested sections (default: visible)

| # | Section | What it shows |
|---|---|---|
| 1 | **Home (Hero)** | Animated intro — name, typewriter roles (e.g. "CS Undergraduate · Full-Stack Developer"), tagline, avatar/photo, CTA buttons (View Projects / Download Resume), social icons, particle + aurora background |
| 2 | **About Me** | Rich-text bio, photo, quick facts (location, degree, interests), "currently learning" chips |
| 3 | **Resume / CV** | Prominent download button + inline PDF preview; resume file replaceable from admin anytime |
| 4 | **Education** | Animated vertical timeline — institution, degree, years, GPA/grade, logo, highlights |
| 5 | **Technical Skills** | Skill categories (Languages, Frameworks, Tools, Databases…) with icons, proficiency indicators, animated marquee of tech logos |
| 6 | **Projects** | Filterable grid of 3D-tilt cards → each opens a **detail page** with gallery, embedded YouTube demo, tech stack chips, GitHub + live-demo buttons, full write-up |
| 7 | **Research & Publications** | Papers/publications — title, authors, venue, year, abstract, DOI/link, PDF download |
| 8 | **Experience** | Work & internships timeline — company, role, type (work/internship), duration, bullet achievements, company logo |
| 9 | **Certifications** | Card grid — certificate image/PDF, issuer, date, credential ID + verify link; click to view full-size in a lightbox |
| 10 | **Achievements & Awards** | Honors, hackathon wins, competitions, scholarships — with images and dates |
| 11 | **GitHub & Coding Profiles** | Cards for GitHub, LeetCode, Codeforces, HackerRank, etc. — live GitHub stats (repos, stars, contribution calendar) fetched from the public GitHub API |
| 12 | **Technical Blogs** *(optional)* | Write posts in the admin's rich-text editor, or link out to Medium/Dev.to posts |
| 13 | **Testimonials** *(optional)* | Quotes from professors, mentors, teammates — carousel with avatars |
| 14 | **Contact** | Animated contact form (saves to database + optional email notification), plus direct email, location, social links |

### 6.2 Extra sections I'm adding (all toggleable)

| Section | Default | What it shows |
|---|---|---|
| **Highlights / Stats strip** | Visible | Animated counters — projects built, certifications, CGPA, hackathons, etc. (numbers editable in admin) |
| **Volunteering & Leadership** | Hidden | Clubs, societies, event organizing, community roles — valuable for a student profile |
| **Gallery** | Hidden | Photos from hackathons, events, presentations |
| **Languages** | Hidden | Spoken languages with proficiency levels |
| **Services / Freelancing** | Hidden | If you later offer freelance work — service cards with descriptions |
| **FAQ** | Hidden | Common questions (e.g. "Are you open to internships?") |

### 6.3 Global elements (always present)

- **Navbar** — glassy, auto-hides on scroll down / reveals on scroll up, active-section highlighting, builds only from visible sections
- **Footer** — social links, quick nav, "built with" note, back-to-top button
- **Preloader** — brief name/logo animation on first load
- **Scroll progress bar** — thin gradient line at the top
- **Custom cursor glow** *(desktop only)* — subtle spotlight following the mouse
- **Custom 404 page** — on-brand, animated

---

## 7. Admin Panel (`/admin`)

A private, login-protected dashboard styled to match the site. **Not linked anywhere publicly.**

| Route | Purpose |
|---|---|
| `/admin/login` | Email + password sign-in (Supabase Auth) |
| `/admin` | Dashboard — content counts, unread messages, quick links |
| `/admin/profile` | Hero + About content: name, roles, taglines, bio (rich text), avatar, resume PDF, social links, contact info |
| `/admin/sections` | **Visibility toggles + drag-to-reorder** for every section |
| `/admin/projects` | Full CRUD — cover image, gallery images, YouTube URL, GitHub URL, live URL, tech tags, rich description, featured flag, draft/published |
| `/admin/education` | CRUD for education entries |
| `/admin/skills` | CRUD for categories and skills (icon picker, proficiency) |
| `/admin/experience` | CRUD for work & internships |
| `/admin/publications` | CRUD for research & publications (+ PDF upload) |
| `/admin/certifications` | CRUD with certificate image/PDF upload + credential links |
| `/admin/achievements` | CRUD for awards & achievements |
| `/admin/coding-profiles` | CRUD for GitHub/LeetCode/etc. profile links |
| `/admin/blogs` | Write/edit posts with rich-text editor, cover image, tags, publish toggle |
| `/admin/testimonials` | CRUD for testimonials |
| `/admin/extras` | Volunteering, gallery, languages, services, FAQ, stats counters |
| `/admin/messages` | Inbox for contact-form submissions (read/unread, delete) |
| `/admin/settings` | Site title, SEO meta description, OG image, accent color, favicon |

**Admin UX details**

- Drag-and-drop image upload with instant preview; images auto-compressed in the browser before upload
- Drag-to-reorder items within every list (projects, skills, education…)
- Paste a YouTube URL → instant embedded preview
- Every save publishes to the live site immediately (on-demand revalidation)
- Fully responsive — manage the site from your phone

---

## 8. Data Model (Supabase)

| Table | Key fields |
|---|---|
| `profile` (1 row) | name, roles[], tagline, bio, avatar_url, resume_url, email, location, socials (json) |
| `site_settings` (1 row) | site_title, meta_description, og_image_url, accent_color |
| `sections` | key, title, visible, sort_order |
| `projects` | title, slug, summary, description (rich), cover_url, gallery (json), tech[], youtube_url, github_url, live_url, featured, published, sort_order |
| `education` | institution, degree, field, start/end dates, grade, logo_url, highlights[], sort_order |
| `skill_categories` / `skills` | category, name, icon, level, sort_order |
| `experience` | company, role, type (work/internship), location, start/end, current, bullets[], logo_url, sort_order |
| `publications` | title, authors, venue, year, abstract, link, pdf_url, type |
| `certifications` | title, issuer, issue_date, credential_id, credential_url, file_url, skills[], sort_order |
| `achievements` | title, description, date, issuer, image_url, category, sort_order |
| `coding_profiles` | platform, username, url, icon, sort_order |
| `blogs` | title, slug, excerpt, content (rich), cover_url, tags[], external_url, published, published_at |
| `testimonials` | name, role, company, avatar_url, quote, sort_order |
| `stats` | label, value, suffix, icon, sort_order |
| `volunteering`, `gallery`, `languages`, `services`, `faqs` | as per section needs |
| `messages` | name, email, subject, message, read, created_at |

**Storage buckets:** `media` (images, public read) · `documents` (resume/certificate/paper PDFs, public read). Writes require admin login.

---

## 9. Security

- Admin routes protected by **middleware** — no session, no access (redirect to login)
- **Row Level Security** on every table: anonymous users can only read; only the authenticated admin can write; `messages` allows public *insert* only
- Contact form protected with honeypot field + rate limiting
- Supabase keys: only the public anon key ships to the browser; RLS is the enforcement layer
- Single admin account created manually in Supabase — public sign-up disabled

---

## 10. Design System — "Dark Futuristic"

**Colors**

| Token | Value | Use |
|---|---|---|
| Background | `#05050A` (near-black, blue-tinted) | Page base |
| Surface | `#0D0D14` + glass (`white/5` + blur) | Cards, navbar |
| Primary accent | Electric violet `#7C3AED` | Buttons, highlights |
| Secondary accent | Cyan `#22D3EE` | Gradient partner, links |
| Signature gradient | violet → fuchsia → cyan | Headings, borders, glows |
| Text | `#F4F4F5` / muted `#A1A1AA` | Copy |

Accent color changeable later from admin settings.

**Typography**

- Headings: **Space Grotesk** (geometric, modern)
- Body: **Inter**
- Code/accent labels: **JetBrains Mono** (e.g. `// about-me` section tags)
- Oversized hero type, gradient text on key words

**Texture & depth** — subtle grain overlay, radial glow orbs, thin `1px` gradient borders, glassmorphism panels, faint grid background in hero.

---

## 11. Animation Catalog

| Where | Effect |
|---|---|
| First load | Preloader with name animation → smooth curtain reveal |
| Hero | Aurora gradient background + floating particles, staggered text entrance, **typewriter** cycling roles, magnetic CTA buttons |
| Scroll (global) | **Lenis** buttery smooth scrolling + scroll progress bar |
| Every section | Scroll-triggered staggered reveals (fade + rise), animated section headings with gradient underline sweep |
| Project cards | 3D tilt on hover, image zoom, glow border tracking the mouse |
| Skill logos | Infinite marquee, pause on hover |
| Timelines (education/experience) | Line draws itself as you scroll; nodes pulse in |
| Stats | Count-up animation when scrolled into view |
| Certificates | Lightbox open with spring animation |
| Buttons/links | Magnetic pull, shine sweep, icon nudges |
| Page transitions | Fade-through between home ↔ project/blog pages |
| Cursor (desktop) | Soft spotlight glow following pointer |

**Restraint rules:** animations are fast (200–600 ms), eased, and never block reading. Full **`prefers-reduced-motion`** support — all motion collapses to simple fades for users who opt out.

---

## 12. SEO, Performance & Accessibility

- Per-page metadata + Open Graph/Twitter cards (editable in admin), sitemap.xml, robots.txt, JSON-LD (Person + CreativeWork)
- `next/image` everywhere, lazy loading, font subsetting via `next/font`, lite YouTube embeds
- Target: **Lighthouse 90+** across the board on the public site
- Semantic HTML, keyboard-navigable, visible focus states, WCAG AA contrast (checked against the dark palette)

---

## 13. Build Phases

| Phase | Deliverable |
|---|---|
| **1. Foundation** | Next.js + Tailwind + fonts + design tokens; Supabase project, full schema, RLS, buckets, admin user; auth middleware |
| **2. Public site** | All sections built with the full animation system, fed by database (seeded with tasteful placeholder content) |
| **3. Detail pages** | Project detail pages (gallery + YouTube + links), blog pages |
| **4. Admin panel** | Login, dashboard, CRUD for every section, media uploads, visibility/reorder controls, messages inbox, settings |
| **5. Polish** | SEO, OG images, 404, loading states, reduced-motion, mobile fine-tuning, performance pass |
| **6. Launch** | GitHub repo, Vercel deploy, env config, live smoke test + a short **owner's guide** (how to use your admin panel) |

Each phase ends with something you can run and click through locally (`npm run dev`).

---

## 14. What I Need From You

**Accounts (all free — needed before Phase 1):**
1. **GitHub** account (code hosting → auto-deploys)
2. **Supabase** account → I'll guide you to create a project and hand me two keys
3. **Vercel** account (sign in with GitHub — needed at Phase 6)

**Machine prerequisites:** Node.js 20+ and Git installed (I'll check and guide installation if missing).

**Content (whenever ready — the site launches fine with placeholders, and you add everything later through the admin panel):** your full name + roles/tagline, a photo, resume PDF, and initial projects/certificates.

---

## 15. Resolved Decisions (were open questions)

1. **Display name:** Ashfaq Riyaldeen · hero roles: Full-Stack Developer / Software Engineer / AI-ML Enthusiast · degree: Computer Engineering (University of Ruhuna) ✔
2. **Contact form:** admin inbox **plus** email notification to nanoxjune@gmail.com via Resend (account + API key set up during launch phase) ✔
3. **Custom domain** — still open; site launches on the free `*.vercel.app` subdomain, custom domain attachable anytime (~$10/yr).

---

## 16. Future Enhancements (not in initial build)

- AI chatbot that answers questions about you ("Ask my portfolio")
- Visitor analytics dashboard inside admin
- Light-theme toggle
- Multi-language support
- Admin "preview mode" to see hidden sections before publishing
