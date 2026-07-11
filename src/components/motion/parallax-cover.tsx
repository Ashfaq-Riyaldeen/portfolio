"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Scroll parallax for card cover media: the (oversized) inner layer drifts
 * vertically as the card crosses the viewport. The inner layer is scaled up
 * for headroom so edges never peek through; hover zoom stays on the media
 * element itself, a separate layer, so the transforms never fight.
 */
export function ParallaxCover({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          innerRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: wrapRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <div ref={innerRef} className="absolute inset-0 scale-[1.18]">
        {children}
      </div>
    </div>
  );
}
