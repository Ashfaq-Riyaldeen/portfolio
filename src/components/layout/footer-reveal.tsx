"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Footer entrance: the top glow line draws itself once, and the content
 * rises/brightens scrubbed to the scroll as the footer comes into view.
 * The line stays outside the translated wrapper so it never moves off the
 * footer's top edge.
 */
export function FooterReveal({ children }: { children: React.ReactNode }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          contentRef.current,
          { y: 64, opacity: 0.4 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: contentRef.current!.parentElement,
              start: "top bottom",
              end: "top 60%",
              scrub: true,
            },
          },
        );
        gsap.from(lineRef.current, {
          scaleX: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: contentRef.current!.parentElement,
            start: "top 92%",
            once: true,
          },
        });
      });
    },
    { scope: contentRef },
  );

  return (
    <>
      {/* Faint glow along the top edge */}
      <div
        ref={lineRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <div ref={contentRef}>{children}</div>
    </>
  );
}
