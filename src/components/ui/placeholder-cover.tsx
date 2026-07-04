import { cn } from "@/lib/utils";

const gradients = [
  "from-violet-600/40 via-fuchsia-500/25 to-cyan-400/30",
  "from-cyan-500/35 via-sky-400/20 to-violet-500/35",
  "from-fuchsia-600/35 via-violet-500/25 to-indigo-400/30",
  "from-indigo-500/35 via-violet-400/20 to-fuchsia-400/30",
];

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

interface PlaceholderCoverProps {
  /** Deterministic gradient pick — same seed, same look. */
  seed: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

/** Branded stand-in shown wherever an image hasn't been uploaded yet. */
export function PlaceholderCover({
  seed,
  label,
  icon,
  className,
}: PlaceholderCoverProps) {
  const gradient = gradients[hash(seed) % gradients.length];

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      <div className="bg-grid absolute inset-0 opacity-40" />
      {icon ?? (
        <span className="font-display text-6xl font-bold text-white/25">
          {label?.trim()[0]?.toUpperCase() ?? "•"}
        </span>
      )}
    </div>
  );
}
