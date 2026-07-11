"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/** The live Lenis instance, or null (reduced motion / not mounted yet). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Buttery smooth scrolling site-wide. Skipped for reduced-motion users.
 * Lenis is driven by gsap.ticker (not its own rAF) and reports every scroll
 * to ScrollTrigger, so scrubbed animations track the lerped scroll exactly.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.12,
      anchors: true,
    });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    // With an external smoother in charge, GSAP must not skip ticks to "catch up".
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
