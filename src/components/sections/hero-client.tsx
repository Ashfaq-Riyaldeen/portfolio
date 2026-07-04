"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { SocialIcon } from "@/components/ui/social-icon";
import { Particles } from "./particles";
import type { Profile } from "@/lib/content";

/** Types a word, holds, deletes, moves to the next — forever. */
function useTypewriter(words: string[], enabled: boolean) {
  const [text, setText] = useState(enabled ? "" : (words[0] ?? ""));
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled || words.length === 0) return;
    const word = words[index % words.length];

    if (!deleting && text === word) {
      const hold = setTimeout(() => setDeleting(true), 1700);
      return () => clearTimeout(hold);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => i + 1);
      return;
    }
    const timer = setTimeout(
      () => setText(word.slice(0, text.length + (deleting ? -1 : 1))),
      deleting ? 34 : 72,
    );
    return () => clearTimeout(timer);
  }, [text, deleting, index, words, enabled]);

  return text;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export function HeroClient({ profile }: { profile: Profile }) {
  const reduce = useReducedMotion();
  const typed = useTypewriter(profile.roles, !reduce);
  const [firstName, ...restName] = profile.name.split(" ");
  const status = profile.quickFacts.find(
    (f) => f.label.toLowerCase() === "status",
  )?.value;

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden"
    >
      {/* Backdrop: grid fading toward edges + aurora orbs + particles */}
      <div
        aria-hidden
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_65%_at_50%_40%,black,transparent)]"
      />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { x: [0, 50, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/4 top-1/4 size-[26rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]"
      />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { x: [0, -45, 35, 0], y: [0, 35, -25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-1/4 right-1/4 size-[22rem] translate-x-1/2 rounded-full bg-secondary/15 blur-[130px]"
      />
      <Particles />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex max-w-4xl flex-col items-center px-6 py-28 text-center"
      >
        {status ? (
          <motion.p
            variants={item}
            className="glass mb-6 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {status}
          </motion.p>
        ) : null}

        <motion.p
          variants={item}
          className="font-mono text-sm text-secondary sm:text-base"
        >
          {"// hi, my name is"}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl"
        >
          {firstName}{" "}
          <span className="text-gradient">{restName.join(" ")}</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 flex h-8 items-center font-mono text-lg text-foreground sm:text-2xl"
        >
          <span className="text-subtle">&gt;&nbsp;</span>
          {typed}
          <motion.span
            aria-hidden
            animate={reduce ? undefined : { opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="ml-0.5 inline-block h-6 w-0.5 bg-secondary sm:h-7"
          />
        </motion.p>

        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a
              href="#projects"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3.5 font-medium text-white shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/45"
            >
              View My Work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={profile.resumeUrl ?? "#resume"}
              className="glass flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-foreground transition-colors hover:bg-white/10"
              {...(profile.resumeUrl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Download className="size-4" />
              Resume
            </a>
          </Magnetic>
        </motion.div>

        <motion.div variants={item} className="mt-10 flex items-center gap-3">
          {profile.socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
              className="glass flex size-11 items-center justify-center rounded-full text-muted transition-all hover:-translate-y-0.5 hover:text-foreground hover:glow-primary"
            >
              <SocialIcon platform={social.platform} className="size-4.5" />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-subtle transition-colors hover:text-muted"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
          scroll
        </span>
        <span className="flex h-9 w-5.5 items-start justify-center rounded-full border border-line p-1.5">
          <motion.span
            animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block h-2 w-1 rounded-full bg-secondary"
          />
        </span>
      </motion.a>
    </section>
  );
}
