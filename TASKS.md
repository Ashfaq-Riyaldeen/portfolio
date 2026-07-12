# Portfolio Build — Task Tracker

> Companion to [PROJECT_SPEC.md](./PROJECT_SPEC.md). Updated as work completes.
> **Last updated:** 2026-07-04
>
> **Legend:** `[x]` done · `[ ]` remaining · **👤 you** = needs an action from Ashfaq (everything else is Claude's job)

## Overall Progress

```
█████████████████████████████░  87 / 88 tasks (~99%)
```

| Phase | Status | Progress |
|---|---|---|
| 0 · Planning & Decisions | ✅ Complete | 4/4 |
| 1 · Foundation | ✅ Complete | 9/9 |
| 2 · Public Site | ✅ Complete | 32/32 |
| 3 · Detail Pages | ✅ Complete | 3/3 |
| 4 · Supabase Backend & Admin Panel | ✅ Complete | 25/25 |
| 5 · Polish | ✅ Complete | 8/8 |
| 6 · Launch | 🔨 In progress | 6/7 |

---

## Phase 0 · Planning & Decisions — ✅ 4/4

- [x] Requirements gathered; section list agreed (14 requested + 6 extra)
- [x] Core decisions locked: custom admin + Supabase · Vercel hosting · dark-futuristic design · student emphasis
- [x] `PROJECT_SPEC.md` written and approved
- [x] Personalization: **Ashfaq Riyaldeen** · Full-Stack Dev / SWE / AI-ML · Computer Engineering (Univ. of Ruhuna) · GitHub `Ashfaq-Riyaldeen` · contact = inbox **+** Resend email

## Phase 1 · Foundation — ✅ 9/9

- [x] Machine verified: Node v22.13.0 · npm 11.1.0 · Git 2.51
- [x] Next.js 16.2.10 scaffolded (TypeScript, Tailwind v4, App Router, `src/`)
- [x] Libraries installed: motion, lenis, lucide-react, clsx, tailwind-merge, @supabase/supabase-js, @supabase/ssr
- [x] Design tokens — dark palette, signature gradient, glass/glow/grid utilities (`globals.css`)
- [x] Fonts wired: Space Grotesk (display) · Inter (body) · JetBrains Mono (code)
- [x] Content model types — all 20 sections (`src/lib/content/types.ts`)
- [x] Placeholder seed content (`src/lib/content/seed.ts`)
- [x] Content access layer with Supabase-ready switch (`src/lib/content/index.ts`)
- [x] `.env.example` template + production build verified

## Phase 2 · Public Site — ✅ 32/32

### Global chrome & animation primitives — 9/9

- [x] Lenis smooth scrolling (reduced-motion aware)
- [x] Gradient scroll-progress bar
- [x] Cursor spotlight glow (desktop only)
- [x] `Reveal` scroll-triggered animation primitive
- [x] `Magnetic` hover-pull primitive
- [x] `Section` + `SectionHeading` layout system
- [x] Social/brand icon set (inline SVGs — lucide v1 dropped brand logos)
- [x] Navbar — glass pill, hide-on-scroll, active-section highlight, mobile overlay menu
- [x] Footer — brand, quick links, socials, back-to-top

### Page wiring — 2/2

- [x] Section registry → page renders only `visible` sections, in order (toggle system works end-to-end)
- [x] Root layout: providers + navbar/footer fed from content layer

### Sections built — 20/20

- [x] **Hero** — particles, aurora orbs, grid backdrop, typewriter roles, status badge, magnetic CTAs, scroll cue
- [x] **About Me** — gradient-framed portrait (placeholder until photo upload), rich bio, quick facts, learning chips
- [x] **Highlights / Stats** — glass cards with count-up numbers
- [x] Resume / CV — download banner (activates once a PDF is uploaded via admin)
- [x] Education — animated vertical timeline
- [x] Technical Skills — categories, proficiency bars, logo marquee
- [x] Projects — filterable grid, 3D-tilt cards, GitHub/demo/details links
- [x] Research & Publications — paper cards with links/PDF
- [x] Experience — work & internship timeline
- [x] Certifications — card grid + lightbox viewer
- [x] Achievements & Awards — honors cards with category icons
- [x] GitHub & Coding Profiles — profile cards + live GitHub stats (auto-hides until real username)
- [x] Technical Blogs — post cards (internal pages + external links)
- [x] Testimonials — auto-advancing quote carousel
- [x] Contact — animated form + info panel *(now saves to the admin inbox via server action; Resend email optional)*
- [x] Volunteering & Leadership *(hidden by default)*
- [x] Gallery *(hidden by default)*
- [x] Languages *(hidden by default)*
- [x] Services *(hidden by default)*
- [x] FAQ *(hidden by default)*

### Checkpoint — 1/1

- [x] **👤 you — Design checkpoint:** approved (continued the build 2026-07-04); tweaks welcome anytime

## Phase 3 · Detail Pages — ✅ 3/3

- [x] Project detail page — gallery, YouTube embed, tech stack, GitHub/live buttons, write-up
- [x] Blog post page — rich content rendering
- [x] Page transitions between home ↔ detail pages

## Phase 4 · Supabase Backend & Admin Panel — ✅ 25/25

### Backend — 7/7 ✅

- [x] **👤 you** — create free Supabase account + project — done 2026-07-04, keys wired into `.env.local`
- [x] Database schema for all content tables — `supabase/schema.sql` applied & verified live
- [x] Row Level Security: public read · admin-only write · public insert on messages
- [x] Storage buckets: `media` (images) + `documents` (PDFs)
- [x] **👤 you** — create the single admin login + disable public sign-ups
- [x] Switch content layer from seed → Supabase (auto-falls back to seed if the DB is unreachable)
- [x] On-demand revalidation (admin saves rebuild the public pages instantly)

### Admin panel — 18/18 ✅

- [x] Auth guard (`src/proxy.ts` — Next 16 middleware) + styled login page at `/admin/login`
- [x] Dashboard — content counts, unread messages, quick links
- [x] Sections manager — **visibility toggles + drag-to-reorder**, publishes on save
- [x] Profile editor — name, roles, bio, avatar, socials, resume PDF (`/admin/profile`)
- [x] Projects CRUD — images, gallery, YouTube/GitHub/live links, tech tags, draft/publish
- [x] Education CRUD
- [x] Skills CRUD (categories + per-skill level rows)
- [x] Experience CRUD
- [x] Publications CRUD (+ PDF upload)
- [x] Certifications CRUD (+ certificate image/PDF upload)
- [x] Achievements CRUD
- [x] Coding profiles CRUD
- [x] Blogs CRUD — write HTML posts or link out; drafts stay hidden
- [x] Testimonials CRUD
- [x] Extras CRUD — stats, volunteering, gallery, languages, services, FAQ
- [x] Reusable media-upload component (drag-drop, preview, auto-compression)
- [x] Messages inbox — read/unread, reply-by-email, delete (`/admin/messages`)
- [x] Settings (`/admin/settings`) · contact form now saves to the inbox via server action + optional Resend email + honeypot & rate-limit spam protection

## Phase 5 · Polish — ✅ 8/8

- [x] Preloader with name animation — letter-by-letter reveal, once per session, skipped for reduced-motion & no-JS safe
- [x] Custom animated 404 page — gradient 404, aurora orbs, home/contact links
- [x] Dynamic SEO metadata from database — title/description/OG image come from Settings in `/admin`
- [x] sitemap.xml (home + published projects/posts) + robots.txt (blocks `/admin`)
- [x] JSON-LD Person structured data + per-page Open Graph images (project/blog covers)
- [x] Accessibility pass — skip-to-content link, `main` landmark, global keyboard-focus ring, reduced-motion respected everywhere
- [x] Performance pass — Supabase preconnect, lazy images, ISR caching, font swap *(run Lighthouse on the live Vercel URL during the Phase 6 smoke test)*
- [x] Mobile pass — responsive sections, horizontal-overflow guard, browser theme color *(final eyeball on a real phone at launch)*

## Phase 6 · Launch — 🔨 6/7

- [x] GitHub repo — public at [github.com/Ashfaq-Riyaldeen/portfolio](https://github.com/Ashfaq-Riyaldeen/portfolio), commits authored by Ashfaq only
- [x] Vercel — deployed at [ashfaq-riyaldeen.vercel.app](https://ashfaq-riyaldeen.vercel.app); pushes to `main` auto-deploy
- [x] Resend — email notifications verified: contact-form messages arrive in Gmail
- [x] Production env vars on Vercel — Supabase ×2, site URL, notification email, Resend key
- [x] Live smoke test — home/projects/sitemap/robots/404/admin guard/contact→inbox→email all verified on production
- [x] **Owner's guide** — [OWNERS_GUIDE.md](./OWNERS_GUIDE.md): daily tasks, field cheat-sheet, troubleshooting
- [ ] **👤 you** — replace placeholder content with your real projects, certificates, photo, resume

---

**🚀 The site is LIVE:** [ashfaq-riyaldeen.vercel.app](https://ashfaq-riyaldeen.vercel.app) — one task left, and it's all yours: open [/admin](https://ashfaq-riyaldeen.vercel.app/admin) and replace the placeholder projects/certificates with the real thing ([OWNERS_GUIDE.md](./OWNERS_GUIDE.md) shows how).

## Post-launch · 2026-07-11

- [x] Domain renamed to [ashfaq-riyaldeen.vercel.app](https://ashfaq-riyaldeen.vercel.app); `NEXT_PUBLIC_SITE_URL` updated; sitemap/robots/og fixed
- [x] Google Search Console verified (file in `public/`, never delete) + sitemap submitted; homepage indexed
- [x] **Animation upgrade** — GSAP (ScrollTrigger/SplitText/ScrambleText) layered over motion + Lenis: char-reveal headings site-wide, hero scroll-away parallax + name char intro + role decode cycler, project-cover parallax, velocity-reactive skills marquee, footer reveal, 404 glitch, contact-success drawn checkmark; lazy desktop-only React Three Fiber 3D particle hero (2D canvas fallback on mobile/reduced-motion/weak GPUs)
- [x] **Boot-sequence loading page** — GSAP preloader: terminal lines decode + name signature reveal + 0→100 counter, curtain-up exit that hands off to the hero intro (first-time visitors now actually see it); once per session, no-JS/reduced-motion safe
- [x] **Fix blank page on older iPhones** — Next 16 ships JS requiring Safari 16.4+, so iOS 15 Safari died on a SyntaxError and showed a black page; added `browserslist` (safari 15) so the build transpiles for it, plus CSS fallbacks for `dvh` units and `in oklab` gradients; verified on WebKit 15.4 + modern WebKit + Chromium
