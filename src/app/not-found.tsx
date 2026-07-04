import Link from "next/link";

export const metadata = { title: "Page not found" };

/** Custom 404 — same dark-futuristic treatment as the rest of the site. */
export default function NotFound() {
  return (
    <main className="bg-grid relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Aurora orbs */}
      <div
        aria-hidden="true"
        className="absolute -left-32 top-1/4 size-96 rounded-full bg-primary/25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-1/4 size-96 rounded-full bg-secondary/20 blur-[120px]"
      />

      <p className="font-mono text-sm text-secondary">{"// error 404"}</p>
      <h1 className="text-gradient mt-4 font-display text-[7rem] font-bold leading-none tracking-tight sm:text-[10rem]">
        404
      </h1>
      <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">
        This page drifted off the grid
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        The page you&apos;re looking for doesn&apos;t exist, was moved, or is
        hiding in a section that&apos;s currently switched off.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/45"
        >
          Back to home
        </Link>
        <Link
          href="/#contact"
          className="glass rounded-full px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-white/8"
        >
          Contact me
        </Link>
      </div>

      <p className="mt-10 font-mono text-[11px] text-subtle">
        {'if (lost) { return home; }'}
      </p>
    </main>
  );
}
