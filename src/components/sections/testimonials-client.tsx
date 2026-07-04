"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/content";
import { cn } from "@/lib/utils";

export function TestimonialsClient({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const current = items[index];

  useEffect(() => {
    if (reduce || paused || items.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      6000,
    );
    return () => clearInterval(timer);
  }, [reduce, paused, items.length]);

  const initials = current.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="relative mx-auto max-w-3xl text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span
        aria-hidden
        className="text-gradient block font-display text-7xl leading-none"
      >
        &ldquo;
      </span>

      <div className="min-h-56 sm:min-h-48">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <blockquote className="text-lg leading-relaxed text-foreground sm:text-xl">
              {current.quote}
            </blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-4">
              {current.avatarUrl ? (
                <Image
                  src={current.avatarUrl}
                  alt={current.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-full border border-line object-cover"
                />
              ) : (
                <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-secondary/30 font-display text-sm font-bold text-foreground">
                  {initials}
                </span>
              )}
              <span className="text-left">
                <span className="block font-display font-semibold text-foreground">
                  {current.name}
                </span>
                <span className="block text-sm text-muted">
                  {current.role}
                  {current.company ? ` · ${current.company}` : ""}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {items.length > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() =>
              setIndex((i) => (i - 1 + items.length) % items.length)
            }
            aria-label="Previous testimonial"
            className="glass flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex items-center gap-2.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index
                    ? "w-7 bg-gradient-to-r from-primary to-secondary"
                    : "w-2 bg-white/15 hover:bg-white/30",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            aria-label="Next testimonial"
            className="glass flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
