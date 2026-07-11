"use client";

import { createElement, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

interface SplitHeadingProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

/**
 * Heading whose characters rise out of per-word masks when scrolled into
 * view. SSR keeps the plain text (SEO/no-JS safe); `autoSplit` re-splits
 * after web fonts swap in so line breaks never end up mis-measured.
 */
export function SplitHeading({
  children,
  className,
  as = "h2",
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(ref.current, {
          type: "words,chars",
          mask: "words",
          autoSplit: true,
          aria: "auto",
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 110,
              stagger: 0.016,
              duration: 0.9,
              ease: "expo.out",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 84%",
                once: true,
              },
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return createElement(as, { ref, className }, children);
}
