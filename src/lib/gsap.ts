import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

/**
 * Single GSAP registration point — import gsap/plugins from here only, and
 * only from "use client" files so none of this lands in server bundles.
 *
 * Reduced-motion convention: every effect lives inside
 * `gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", ...)`
 * so the OS setting disables GSAP work the same way `useReducedMotion`
 * gates the motion/react components.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);
  // Mobile URL-bar show/hide fires resize; ignore it so triggers don't jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
