"use client";

import { useEffect } from "react";

/**
 * First-load name animation. All timing lives in globals.css so the overlay
 * always clears itself; this component only handles the once-per-session
 * skip — the inline script runs during HTML parse, before first paint, so
 * repeat loads never flash the overlay.
 */
export function Preloader({ name }: { name: string }) {
  useEffect(() => {
    try {
      sessionStorage.setItem("ar-preloaded", "1");
    } catch {
      // private mode — the preloader just plays on every load
    }
  }, []);

  const words = name.split(" ");
  let letterIndex = 0;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("ar-preloaded"))document.documentElement.classList.add("preloader-skip")}catch(e){}`,
        }}
      />
      <div className="preloader" aria-hidden="true">
        <p className="flex flex-wrap justify-center gap-x-[0.35em] px-6 font-display text-3xl font-bold tracking-tight sm:text-5xl">
          {words.map((word, w) => (
            <span key={w} className="whitespace-nowrap">
              {[...word].map((letter, l) => {
                const delay = 0.15 + letterIndex++ * 0.045;
                return (
                  <span
                    key={l}
                    className="preloader-letter text-gradient"
                    style={{ animationDelay: `${delay}s` }}
                  >
                    {letter}
                  </span>
                );
              })}
            </span>
          ))}
        </p>
        <div className="preloader-bar" />
      </div>
    </>
  );
}
