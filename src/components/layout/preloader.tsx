"use client";

import { useEffect, useRef } from "react";
import { paintGradientChars } from "@/lib/gradient-chars";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { markPreloaderDone } from "@/lib/preloader-gate";

/** No angle brackets — ScrambleText writes via innerHTML. */
const SCRAMBLE_CHARS = "01_/#$*+";

/**
 * First-load boot sequence: terminal lines decode, the name rises in the
 * gradient while a counter runs 0→100, then the whole screen lifts like a
 * curtain and opens the preloader gate so the hero intro plays beneath it.
 *
 * Safety nets: the inline script skips repeat visits before first paint;
 * a pure-CSS exit animation clears the overlay even if JS never runs (GSAP
 * disarms it when the timeline takes over); reduced-motion hides the
 * overlay entirely via CSS and opens the gate immediately.
 */
export function Preloader({ name }: { name: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const accentRef = useRef<HTMLParagraphElement>(null);
  const accentTextRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const [firstName, ...restName] = name.split(" ");
  const bootLines = [
    `init ${firstName.toLowerCase()}.dev`,
    "loading modules",
    "mounting interface",
  ];

  useEffect(() => {
    try {
      sessionStorage.setItem("ar-preloaded", "1");
    } catch {
      // private mode — the preloader just plays on every load
    }
  }, []);

  // The hero holds its intro until the gate opens — make sure it can never
  // wait past the CSS failsafe window, whatever happens to the timeline.
  useEffect(() => {
    const failsafe = setTimeout(markPreloaderDone, 4600);
    return () => clearTimeout(failsafe);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (
        document.documentElement.classList.contains("preloader-skip") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        // Overlay is display:none via CSS in both cases — just unblock the hero.
        markPreloaderDone();
        return;
      }

      // GSAP owns the exit now — disarm the CSS no-JS failsafe.
      root.style.animation = "none";

      const lineTexts = gsap.utils.toArray<HTMLElement>("[data-boot-text]", root);
      const lineOks = gsap.utils.toArray<HTMLElement>("[data-boot-ok]", root);

      // Name reveal is its own tween so autoSplit font re-splits rebuild it;
      // it stays paused until the timeline reaches the signature beat.
      let nameStarted = false;
      let nameTween: gsap.core.Tween | null = null;
      const split = SplitText.create(nameRef.current, {
        type: "chars",
        mask: "chars",
        autoSplit: true,
        aria: "auto",
        onSplit: (self) => {
          paintGradientChars(nameRef.current!, self.chars);
          nameTween = gsap.from(self.chars, {
            yPercent: 110,
            stagger: 0.02,
            duration: 0.8,
            ease: "expo.out",
            paused: !nameStarted,
          });
          return nameTween;
        },
      });

      const counter = { v: 0 };
      const tl = gsap.timeline();

      // Progress counter + gradient bar run the length of the boot.
      tl.to(
        counter,
        {
          v: 100,
          duration: 2.3,
          ease: "power2.inOut",
          snap: { v: 1 },
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(counter.v).padStart(3, "0");
            }
          },
        },
        0,
      );
      tl.to(barRef.current, { scaleX: 1, duration: 2.3, ease: "power2.inOut" }, 0);

      // Terminal boot lines decode in sequence, each stamped "ok".
      bootLines.forEach((line, i) => {
        const at = 0.1 + i * 0.32;
        tl.to(
          lineTexts[i],
          {
            duration: 0.42,
            scrambleText: { text: line, chars: SCRAMBLE_CHARS, speed: 0.5 },
          },
          at,
        );
        tl.to(lineOks[i], { autoAlpha: 1, duration: 0.18 }, at + 0.46);
      });

      // Signature: the name rises out of per-char masks, center stage.
      tl.set(nameRef.current, { autoAlpha: 1 }, 1.05);
      tl.call(
        () => {
          nameStarted = true;
          nameTween?.play();
        },
        undefined,
        1.05,
      );

      // Accent line decodes under the name.
      tl.set(accentRef.current, { autoAlpha: 1 }, 1.55);
      tl.to(
        accentTextRef.current,
        {
          duration: 0.7,
          scrambleText: {
            text: "portfolio.ready",
            chars: SCRAMBLE_CHARS,
            speed: 0.4,
          },
        },
        1.55,
      );

      // Boot complete: quick glow pulse on the bar.
      tl.to(
        barRef.current,
        {
          boxShadow: "0 0 22px 3px rgba(167, 139, 250, 0.55)",
          duration: 0.22,
          yoyo: true,
          repeat: 1,
        },
        2.35,
      );

      // Curtain up — the hero intro starts the moment the lift begins. The
      // inner content drifts the other way for depth while the root clips it.
      tl.add("exit", 2.55);
      tl.call(markPreloaderDone, undefined, "exit");
      tl.to(root, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, "exit");
      tl.to(
        innerRef.current,
        { yPercent: 18, duration: 0.85, ease: "expo.inOut" },
        "exit",
      );
      tl.set(root, { display: "none" });

      return () => split.revert();
    },
    { scope: rootRef },
  );

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("ar-preloaded"))document.documentElement.classList.add("preloader-skip")}catch(e){}`,
        }}
      />
      <div ref={rootRef} className="preloader" aria-hidden="true">
        <div
          ref={innerRef}
          className="grid h-full grid-rows-[1fr_auto_1fr] px-6 py-8 sm:px-10 sm:py-10"
        >
          <div className="space-y-1.5 self-start font-mono text-xs text-muted sm:text-sm">
            {bootLines.map((_, i) => (
              <p key={i} className="flex items-baseline gap-2">
                <span className="text-subtle">&gt;</span>
                <span data-boot-text />
                <span data-boot-ok className="text-secondary opacity-0">
                  ok
                </span>
              </p>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 self-center text-center">
            <p
              ref={nameRef}
              className="font-display text-4xl font-bold tracking-tight opacity-0 sm:text-6xl lg:text-7xl"
            >
              {firstName}{" "}
              <span className="text-gradient">{restName.join(" ")}</span>
            </p>
            <p
              ref={accentRef}
              className="font-mono text-sm text-muted opacity-0 sm:text-base"
            >
              <span className="text-subtle">{"// "}</span>
              <span ref={accentTextRef} />
            </p>
          </div>

          <div className="flex items-center gap-5 self-end">
            <div className="preloader-bar-track flex-1">
              <div ref={barRef} className="preloader-bar-fill" />
            </div>
            <span className="font-mono text-sm tabular-nums text-muted">
              <span ref={counterRef}>000</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
