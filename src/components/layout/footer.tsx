import { ArrowUp } from "lucide-react";
import { SocialIcon } from "@/components/ui/social-icon";
import type { Profile } from "@/lib/content";
import type { NavLink } from "./navbar";

interface FooterProps {
  profile: Profile;
  links: NavLink[];
}

export function Footer({ profile, links }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line">
      {/* Faint glow along the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {/* Brand */}
        <div>
          <p className="font-display text-xl font-bold tracking-tight">
            <span className="text-gradient">{profile.name}</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {profile.tagline}
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer">
          <p className="font-mono text-xs uppercase tracking-widest text-subtle">
            Navigate
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`/#${link.id}`}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Socials */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-subtle">
            Connect
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {profile.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                className="glass flex size-10 items-center justify-center rounded-full text-muted transition-all hover:text-foreground hover:glow-primary"
              >
                <SocialIcon platform={social.platform} className="size-4.5" />
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="glass flex size-10 items-center justify-center rounded-full text-muted transition-all hover:text-foreground hover:glow-primary"
            >
              <SocialIcon platform="mail" className="size-4.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6">
          <p className="text-xs text-subtle">
            © {year} {profile.name} · Built with Next.js & Supabase
          </p>
          <a
            href="#top"
            aria-label="Back to top"
            className="glass flex size-10 items-center justify-center rounded-full text-muted transition-all hover:text-foreground hover:glow-primary"
          >
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
