"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

const inputClasses =
  "w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-subtle transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-subtle"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-subtle"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={inputClasses}
        />
      </div>

      <div aria-live="polite">
        {state.error ? (
          <p role="alert" className="text-sm text-red-400">
            {state.error}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-primary/45 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
