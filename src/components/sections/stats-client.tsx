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
import { statNumberFormat } from "@/lib/content/stat-format";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const format = statNumberFormat(value);
  const rounded = useTransform(mv, (v) => format.format(v));

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
    <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-4 md:grid-cols-3">
      {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} y={0} className="h-full">
          <div data-highlight-card className="glass group relative flex h-full min-h-48 flex-col items-center justify-center overflow-hidden rounded-2xl px-4 py-8 text-center transition-colors hover:bg-white/6 sm:px-6">
            <div
              aria-hidden
              className="absolute -top-10 left-1/2 size-24 -translate-x-1/2 rounded-full bg-primary/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <p className="text-gradient flex min-h-14 items-baseline justify-center gap-x-0.5 whitespace-nowrap font-display text-4xl font-bold tabular-nums lg:text-5xl">
              <span className="sr-only">{`${statNumberFormat(stat.value).format(stat.value)}${stat.suffix}`}</span>
              <span aria-hidden="true" className="inline-flex items-baseline gap-x-0.5">
              <Counter value={stat.value} />
              {stat.suffix && <span className="text-xl lg:text-2xl">{stat.suffix}</span>}
              </span>
            </p>
            <p className="mt-3 flex min-h-10 items-center justify-center text-sm font-medium tracking-wide text-muted sm:text-base">
              {stat.label}
            </p>
          </div>
          </Reveal>
      ))}
    </div>
  );
}
