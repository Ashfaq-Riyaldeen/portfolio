"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface ScrubProps {
  children?: React.ReactNode;
  className?: string;
  /**
   * Vertical travel in px, spread across the element's whole trip through
   * the viewport: starts at +y/2, ends at -y/2. Negative flips direction.
   */
  y?: number;
  /** Scale from → to while entering (settles by mid-viewport). */
  scale?: [number, number];
  /** Draw in horizontally: scaleX 0 → 1 from the left edge while entering. */
  drawX?: boolean;
}

/**
 * Scroll-scrubbed movement: the tween's playhead is bound to scroll
 * position, so scrolling back up plays it in reverse. Transform-only —
 * cheap on phones and never shifts layout. Pure `y` drifts run for the
 * element's entire viewport journey; `scale`/`drawX` settle while the
 * element is still comfortably in view.
 */
export function Scrub({ children, className, y = 0, scale, drawX }: ScrubProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const from: gsap.TweenVars = {};
        const to: gsap.TweenVars = { ease: "none" };
        if (y) {
          from.y = y / 2;
          to.y = -y / 2;
        }
        if (scale) {
          from.scale = scale[0];
          to.scale = scale[1];
        }
        if (drawX) {
          from.scaleX = 0;
          to.scaleX = 1;
          from.transformOrigin = to.transformOrigin = "left center";
        }

        const settles = Boolean(scale || drawX);
        to.scrollTrigger = {
          trigger: ref.current,
          start: settles ? "top 92%" : "top bottom",
          end: settles ? "top 55%" : "bottom top",
          scrub: true,
        };
        gsap.fromTo(ref.current, from, to);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
