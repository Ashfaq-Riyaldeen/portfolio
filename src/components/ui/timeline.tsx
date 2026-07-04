"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";

export interface TimelineItem {
  /** Mono date range, e.g. "Jun 2025 — Present" */
  period: string;
  title: string;
  subtitle: string;
  /** Small chip next to the period (e.g. "Internship", "GPA 3.8") */
  badge?: string | null;
  points?: string[];
}

/** Vertical timeline whose gradient line draws itself as you scroll. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative">
      {/* Track + animated fill */}
      <div
        aria-hidden
        className="absolute bottom-2 left-[7px] top-2 w-px bg-line"
      />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-primary via-accent to-secondary"
      />

      <ol className="space-y-12">
        {items.map((item, i) => (
          <li key={`${item.title}-${i}`} className="relative pl-10 sm:pl-12">
            {/* Node */}
            <span
              aria-hidden
              className="absolute left-0 top-1.5 flex size-[15px] items-center justify-center rounded-full border border-secondary/60 bg-background shadow-[0_0_12px_rgba(34,211,238,0.45)]"
            >
              <span className="size-1.5 rounded-full bg-secondary" />
            </span>

            <Reveal delay={i * 0.06}>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-mono text-xs text-secondary">{item.period}</p>
                {item.badge ? (
                  <span className="glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold text-foreground sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
              {item.points && item.points.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary-bright/70" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
