import { CursorGlow } from "@/components/layout/cursor-glow";
import { Footer } from "@/components/layout/footer";
import { Navbar, type NavLink } from "@/components/layout/navbar";
import { Preloader } from "@/components/layout/preloader";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { isBuilt } from "@/components/sections/registry";
import { getProfile, getVisibleSections } from "@/lib/content";

/** Chrome for the public site — the admin area has its own shell. */
export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, sections] = await Promise.all([
    getProfile(),
    getVisibleSections(),
  ]);

  // Navbar/footer links: visible sections that exist, minus hero (the
  // monogram links home) and contact (it gets the CTA button instead).
  const navLinks: NavLink[] = sections
    .filter((s) => isBuilt(s.key) && s.key !== "hero" && s.key !== "contact")
    .map((s) => ({ id: s.key, label: s.navLabel }));

  // Person structured data for search engines, built from the live profile.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    email: `mailto:${profile.email}`,
    jobTitle: profile.roles[0],
    description: profile.tagline,
    ...(profile.avatarUrl ? { image: profile.avatarUrl } : {}),
    ...(profile.location
      ? { address: { "@type": "PostalAddress", addressLocality: profile.location } }
      : {}),
    sameAs: profile.socials.map((s) => s.url),
  };

  return (
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Preloader name={profile.name} />
      <a
        href="#main"
        className="sr-only z-[110] rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <div id="top" className="relative flex min-h-dvh flex-col">
        <ScrollProgress />
        <CursorGlow />
        <Navbar links={navLinks} name={profile.name} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer profile={profile} links={navLinks} />
      </div>
    </SmoothScroll>
  );
}
