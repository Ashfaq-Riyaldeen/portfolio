"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Particles } from "@/components/sections/particles";

// ssr:false is only legal inside a client component — that's exactly why
// this wrapper exists. The three.js chunk is downloaded only when the 3D
// path is taken (never on phones / reduced motion / weak devices).
const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => null,
});

function canWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Hero particle backdrop with progressive enhancement: everyone gets the
 * cheap 2D canvas immediately; capable desktops upgrade to the 3D scene
 * after the browser goes idle, keeping it out of the critical path.
 */
export function HeroBackdrop() {
  const [use3d, setUse3d] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const capable =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(pointer: coarse)").matches &&
      window.matchMedia("(min-width: 1024px)").matches &&
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ??
        8) >= 4 &&
      canWebGL();
    if (!capable) return;

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setUse3d(true));
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setUse3d(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      {!sceneReady && <Particles />}
      {use3d && <HeroScene onReady={() => setSceneReady(true)} />}
    </>
  );
}
