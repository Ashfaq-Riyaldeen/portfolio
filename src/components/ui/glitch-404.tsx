"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The 404 glyphs periodically glitch through terminal characters before
 * settling — same decode language as the hero roles. Static for
 * reduced-motion users.
 */
export function Glitch404() {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ repeat: -1, repeatDelay: 3.4, delay: 0.4 })
          .to(ref.current, {
            duration: 0.9,
            scrambleText: {
              text: "404",
              chars: "01_/#$*+",
              speed: 0.3,
            },
          });
      });
    },
    { scope: ref },
  );

  return (
    <h1
      ref={ref}
      className="text-gradient mt-4 font-display text-[7rem] font-bold leading-none tracking-tight sm:text-[10rem]"
    >
      404
    </h1>
  );
}
