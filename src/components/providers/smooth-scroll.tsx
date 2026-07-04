"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Buttery smooth scrolling site-wide. Skipped for reduced-motion users. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      anchors: true,
    });

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
