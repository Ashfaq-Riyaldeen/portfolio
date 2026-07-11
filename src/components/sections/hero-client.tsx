"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroBackdrop } from "@/components/three/hero-backdrop";
import { SocialIcon } from "@/components/ui/social-icon";
import { paintGradientChars } from "@/lib/gradient-chars";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/preloader-gate";
import type { Profile } from "@/lib/content";

const container: Variants = {
  hidden: {},
  show: {},
};

/**
 * Characters the role text tumbles through while decoding — matches the
 * site's terminal aesthetic. No angle brackets: ScrambleText writes via
 * innerHTML, so "<" would be parsed as markup and eat the text.
 */
const SCRAMBLE_CHARS = "01_/#$*+";

export function HeroClient({ profile }: { profile: Profile }) {
  const reduce = useReducedMotion();
  const [firstName, ...restName] = profile.name.split(" ");
  const status = profile.quickFacts.find(
    (f) => f.label.toLowerCase() === "status",
  )?.value;

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  // The whole intro waits for the preloader curtain to start lifting, so
  // first-time visitors actually see it (repeat visits open the gate at
  // hydration, which matches the old play-on-mount behavior).
  const [introReady, setIntroReady] = useState(false);
  useEffect(() => onPreloaderDone(() => setIntroReady(true)), []);

  // Intro stagger with explicit slots (0.15 + slot × 0.1). Slot 2 belongs to
  // the h1, whose reveal is a GSAP SplitText below — keep them in sync.
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: (slot: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.15 + slot * 0.1,
      },
    }),
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Name: characters rise out of per-char masks (intro slot 2).
        // Held paused until the preloader gate opens; autoSplit font
        // re-splits rebuild the tween, so track the current one.
        let started = false;
        let introTween: gsap.core.Tween | null = null;
        const split = SplitText.create(headingRef.current, {
          type: "chars",
          mask: "chars",
          autoSplit: true,
          aria: "auto",
          onSplit: (self) => {
            paintGradientChars(headingRef.current!, self.chars);
            introTween = gsap.from(self.chars, {
              yPercent: 110,
              stagger: 0.02,
              duration: 0.9,
              ease: "expo.out",
              delay: 0.35,
              paused: !started,
            });
            return introTween;
          },
        });

        // Roles: terminal-style decode, cycling forever (from gate-open).
        let cycle: gsap.core.Timeline | null = null;
        const roles = profile.roles;
        if (roles.length > 1 && roleRef.current) {
          const cycleTl = gsap.timeline({
            repeat: -1,
            delay: 2.4,
            repeatDelay: 1.9,
            paused: true,
          });
          roles.forEach((_, i) => {
            cycleTl.to(
              roleRef.current,
              {
                duration: 1.1,
                scrambleText: {
                  text: roles[(i + 1) % roles.length],
                  chars: SCRAMBLE_CHARS,
                  speed: 0.4,
                },
              },
              i === 0 ? 0 : "+=1.9",
            );
          });
          cycle = cycleTl;
        }

        // Curtain lift → play the intro. restart(true) honors each delay,
        // keeping the original choreography anchored to the gate instead
        // of page load.
        const unsubscribe = onPreloaderDone(() => {
          started = true;
          introTween?.restart(true);
          cycle?.restart(true);
        });

        // Scroll-away: hero sinks and dissolves as the next section
        // slides over it. Orbs move on their WRAPPERS so this never
        // fights the motion drift running on the inner nodes.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .to(orbARef.current, { yPercent: 25 }, 0)
          .to(orbBRef.current, { yPercent: 40 }, 0)
          .to(gridRef.current, { yPercent: 12, opacity: 0 }, 0)
          .to(contentRef.current, { yPercent: -10, opacity: 0.2 }, 0);

        return () => {
          unsubscribe();
          split.revert();
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden"
    >
      {/* Backdrop: grid fading toward edges + aurora orbs + particles */}
      <div
        ref={gridRef}
        aria-hidden
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_65%_at_50%_40%,black,transparent)]"
      />
      <div
        ref={orbARef}
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/4 -translate-x-1/2"
      >
        <motion.div
          animate={
            reduce ? undefined : { x: [0, 50, -30, 0], y: [0, -40, 30, 0] }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="size-[26rem] rounded-full bg-primary/25 blur-[130px]"
        />
      </div>
      <div
        ref={orbBRef}
        aria-hidden
        className="pointer-events-none absolute bottom-1/4 right-1/4 translate-x-1/2"
      >
        <motion.div
          animate={
            reduce ? undefined : { x: [0, -45, 35, 0], y: [0, 35, -25, 0] }
          }
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="size-[22rem] rounded-full bg-secondary/15 blur-[130px]"
        />
      </div>
      <HeroBackdrop />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate={introReady ? "show" : "hidden"}
          className="mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center"
        >
          {status ? (
            <motion.p
              variants={item}
              custom={0}
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
            custom={1}
            className="font-mono text-sm text-secondary sm:text-base"
          >
            {"// hi, my name is"}
          </motion.p>

          <h1
            ref={headingRef}
            className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl"
          >
            {firstName}{" "}
            <span className="text-gradient">{restName.join(" ")}</span>
          </h1>

          <motion.p
            variants={item}
            custom={3}
            className="mt-6 flex h-8 items-center font-mono text-lg text-foreground sm:text-2xl"
          >
            <span className="text-subtle">&gt;&nbsp;</span>
            <span className="sr-only">{profile.roles.join(" · ")}</span>
            <span ref={roleRef} aria-hidden="true">
              {profile.roles[0] ?? ""}
            </span>
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-0.5 inline-block h-6 w-0.5 bg-secondary sm:h-7"
            />
          </motion.p>

          <motion.p
            variants={item}
            custom={4}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            variants={item}
            custom={5}
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

          <motion.div
            variants={item}
            custom={6}
            className="mt-10 flex items-center gap-3"
          >
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
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: introReady ? 1 : 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-subtle transition-colors hover:text-muted"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
          scroll
        </span>
        <span className="flex h-9 w-5.5 items-start justify-center rounded-full border border-line p-1.5">
          <motion.span
            animate={
              reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block h-2 w-1 rounded-full bg-secondary"
          />
        </span>
      </motion.a>
    </section>
  );
}
