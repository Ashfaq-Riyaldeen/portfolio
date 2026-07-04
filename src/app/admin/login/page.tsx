import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="bg-grid relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      {/* Aurora glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 size-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] bottom-[15%] size-[320px] rounded-full bg-secondary/10 blur-[100px]"
      />

      <div className="glass relative w-full max-w-sm rounded-2xl p-8">
        <p className="font-mono text-sm text-secondary">{"// admin"}</p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
          Welcome back<span className="text-gradient">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted">
          Sign in to manage your portfolio.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
