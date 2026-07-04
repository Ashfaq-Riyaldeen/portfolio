"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/reveal";
import type { Stat } from "@/lib/content";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, reduce, value, mv]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
    </span>
  );
}

export function StatsClient({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Reveal key={stat.label} delay={i * 0.08}>
          <div className="glass group relative overflow-hidden rounded-2xl px-6 py-8 text-center transition-colors hover:bg-white/6">
            <div
              aria-hidden
              className="absolute -top-10 left-1/2 size-24 -translate-x-1/2 rounded-full bg-primary/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <p className="text-gradient font-display text-4xl font-bold sm:text-5xl">
              <Counter value={stat.value} />
              {stat.suffix}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-subtle">
              {stat.label}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
