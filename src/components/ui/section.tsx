import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

/** Consistent width, padding, and anchor offset for every page section. */
export function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-28",
        className,
      )}
    >
      {children}
    </section>
  );
}

interface SectionHeadingProps {
  /** Mono eyebrow label, rendered as `// eyebrow` */
  eyebrow: string;
  title: string;
  /** Optional supporting line under the title. */
  lead?: string;
  align?: "left" | "center";
}

/** Section header: mono eyebrow, display title, gradient underline sweep. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn("mb-12 sm:mb-16", centered && "text-center")}
    >
      <p className="font-mono text-sm text-secondary">
        {"// "}
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <div
        className={cn(
          "mt-4 h-px w-24 bg-gradient-to-r from-primary via-accent to-secondary",
          centered && "mx-auto",
        )}
      />
      {lead ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed text-muted",
            centered && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}
