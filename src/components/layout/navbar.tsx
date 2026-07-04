"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavLink {
  /** Section anchor id, e.g. "about" */
  id: string;
  label: string;
}

interface NavbarProps {
  links: NavLink[];
  name: string;
}

/**
 * The desktop pill fits ~7 links before it overflows the viewport; the rest
 * stay reachable through the overlay menu (all links, always).
 */
const MAX_PILL_LINKS = 7;

/** Monogram from a full name: "Ashfaq Riyaldeen" → "AR" */
function monogram(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Navbar({ links, name }: NavbarProps) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  // Hide on scroll down, reveal on scroll up
  useMotionValueEvent(scrollY, "change", (y) => {
    const goingDown = y > lastY.current;
    setHidden(goingDown && y > 160 && !open);
    lastY.current = y;
  });

  // Highlight the section currently in the middle of the viewport
  useEffect(() => {
    if (!onHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const link of links) {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [links, onHome]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  const pillLinks = links.slice(0, MAX_PILL_LINKS);
  const hasOverflow = links.length > MAX_PILL_LINKS;

  return (
    <>
      <motion.header
        initial={false}
        animate={hidden ? "hidden" : "visible"}
        variants={{ visible: { y: 0 }, hidden: { y: "-160%" } }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav className="glass flex w-full max-w-4xl items-center justify-between rounded-full py-2 pl-5 pr-2">
          <a
            href={href("hero")}
            className="font-display text-lg font-bold tracking-tight"
            aria-label={`${name} — home`}
          >
            <span className="text-gradient">{monogram(name)}</span>
            <span className="text-secondary">.</span>
          </a>

          {/* Desktop links — first few sections; the overlay menu has them all */}
          <ul className="hidden items-center gap-1 lg:flex">
            {pillLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={href(link.id)}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-foreground",
                    active === link.id && "text-foreground",
                  )}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/8"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={href("contact")}
              className="hidden rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 lg:block"
            >
              Let&apos;s Talk
            </a>

            {/* Menu button — always on mobile; on desktop only when links overflow the pill */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "glass flex size-10 items-center justify-center rounded-full text-foreground",
                !hasOverflow && "lg:hidden",
              )}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Overlay menu — every section, on any screen size */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-background/90 backdrop-blur-xl"
          >
            <nav className="flex h-full flex-col items-center justify-center gap-2 px-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={href(link.id)}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.045, duration: 0.4 }}
                  className={cn(
                    "font-display text-2xl font-semibold text-muted transition-colors hover:text-foreground",
                    active === link.id && "text-gradient",
                  )}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={href("contact")}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + links.length * 0.045, duration: 0.4 }}
                className="mt-6 rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-3 font-medium text-white"
              >
                Let&apos;s Talk
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
