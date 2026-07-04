"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin gradient bar at the very top showing scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-secondary"
    />
  );
}
