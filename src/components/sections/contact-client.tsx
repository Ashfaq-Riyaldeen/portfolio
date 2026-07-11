"use client";

import { Send } from "lucide-react";
import { useActionState, useRef } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { gsap, useGSAP } from "@/lib/gsap";
import { sendContactMessage, type ContactState } from "@/lib/actions/contact";

interface ContactFormProps {
  toEmail: string;
}

const inputClasses =
  "w-full rounded-xl border border-line bg-white/4 px-4 py-3 text-sm text-foreground placeholder:text-subtle focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors";

const initialState: ContactState = { ok: false };

/** Total length of the checkmark path — drives the stroke draw. */
const CHECK_LENGTH = 20;

/** Success badge: the circle pops in, the check draws itself, glow pulses. */
function SuccessCheck() {
  const badgeRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline()
          .fromTo(
            badgeRef.current,
            { scale: 0.4, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
          )
          .fromTo(
            "[data-check]",
            { strokeDashoffset: CHECK_LENGTH },
            { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" },
            "-=0.15",
          )
          .fromTo(
            badgeRef.current,
            { boxShadow: "0 0 0px 0px rgba(167, 139, 250, 0)" },
            {
              boxShadow: "0 0 46px 6px rgba(167, 139, 250, 0.55)",
              duration: 0.45,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
            },
            "-=0.25",
          );
      });
    },
    { scope: badgeRef },
  );

  return (
    <span
      ref={badgeRef}
      className="mx-auto flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-7"
        fill="none"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path
          data-check
          d="M5 12.5l4.5 4.5L19 7.5"
          strokeDasharray={CHECK_LENGTH}
        />
      </svg>
    </span>
  );
}

/**
 * Contact form. Submits to a server action that stores the message in the
 * admin inbox and (when Resend is configured) emails a notification.
 */
export function ContactForm({ toEmail }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  if (state.ok) {
    return (
      <div className="glass rounded-3xl p-10 text-center sm:p-14">
        <SuccessCheck />
        <h3 className="mt-6 font-display text-xl font-bold">Message sent!</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Thanks for reaching out — I read every message and I&apos;ll get back to
          you soon. In a hurry? Write to me directly at{" "}
          <a href={`mailto:${toEmail}`} className="text-secondary underline-offset-2 hover:underline">
            {toEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="glass rounded-3xl p-7 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-subtle"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            placeholder="Your name"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-subtle"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="contact-subject"
          className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-subtle"
        >
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          placeholder="What's this about?"
          className={inputClasses}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="contact-message"
          className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-subtle"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about your project, internship, or idea…"
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] top-0 h-0 w-0 opacity-0"
      />

      <Magnetic className="mt-7 block">
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-4 font-medium text-white shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/45 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="size-4" />
          {pending ? "Sending…" : "Send Message"}
        </button>
      </Magnetic>

      <p aria-live="polite" className="mt-4 text-center font-mono text-[11px]">
        {state.error ? (
          <span role="alert" className="text-red-400">
            {state.error}
          </span>
        ) : (
          <span className="text-subtle">
            {"// goes straight to my inbox — no email app needed"}
          </span>
        )}
      </p>
    </form>
  );
}
