"use client";

import { ExternalLink, Inbox, LayoutDashboard, Layers, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MANAGE_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sections", label: "Sections", icon: Layers },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const CONTENT_NAV = [
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/c/projects", label: "Projects" },
  { href: "/admin/c/blogs", label: "Blog" },
  { href: "/admin/c/education", label: "Education" },
  { href: "/admin/c/skills", label: "Skills" },
  { href: "/admin/c/experience", label: "Experience" },
  { href: "/admin/c/publications", label: "Publications" },
  { href: "/admin/c/certifications", label: "Certifications" },
  { href: "/admin/c/achievements", label: "Achievements" },
  { href: "/admin/c/coding-profiles", label: "Coding Profiles" },
  { href: "/admin/c/testimonials", label: "Testimonials" },
  { href: "/admin/c/stats", label: "Stats" },
  { href: "/admin/c/volunteering", label: "Volunteering" },
  { href: "/admin/c/gallery", label: "Gallery" },
  { href: "/admin/c/languages", label: "Languages" },
  { href: "/admin/c/services", label: "Services" },
  { href: "/admin/c/faqs", label: "FAQ" },
];

interface AdminShellProps {
  email: string;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}

/** Sidebar layout for the admin panel — top bar on mobile, rail on desktop. */
export function AdminShell({ email, signOutAction, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh lg:flex">
      <aside className="border-b border-line bg-surface/40 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:px-6 lg:py-7">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-display text-lg font-bold">
              <span className="text-gradient">AR</span>
              <span className="text-secondary">.</span>
            </span>
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-subtle">
              admin
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="View live site"
              className="rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <ExternalLink className="size-4" />
              <span className="sr-only">View live site</span>
            </a>
            <form action={signOutAction}>
              <button
                type="submit"
                title="Sign out"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <LogOut className="size-4" />
                <span className="sr-only">Sign out</span>
              </button>
            </form>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:px-4 lg:pb-4">
          {MANAGE_NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/8 text-foreground"
                    : "text-muted hover:bg-white/5 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}

          <p className="hidden px-3.5 pb-1 pt-5 font-mono text-[10px] uppercase tracking-widest text-subtle lg:block">
            Content
          </p>
          {CONTENT_NAV.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "shrink-0 rounded-xl px-3.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-white/8 font-medium text-foreground"
                    : "text-muted hover:bg-white/5 hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-line px-6 py-4 lg:block">
          <p className="truncate font-mono text-[11px] text-subtle" title={email}>
            {email}
          </p>
        </div>
      </aside>

      <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
