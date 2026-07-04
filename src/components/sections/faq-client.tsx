"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import type { FaqEntry } from "@/lib/content";
import { cn } from "@/lib/utils";

export function FaqClient({ items }: { items: FaqEntry[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={item.question} delay={i * 0.05}>
            <div className="glass overflow-hidden rounded-2xl">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 p-6 text-left"
              >
                <span className="font-display font-semibold text-foreground">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-secondary transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted">
                      {item.answer}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
