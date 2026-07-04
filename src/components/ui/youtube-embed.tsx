"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { youtubeId } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  url: string;
  title: string;
  className?: string;
}

/**
 * Lite YouTube embed: renders only the thumbnail until clicked, then swaps
 * in the real (privacy-enhanced) player. Keeps pages fast.
 */
export function YouTubeEmbed({ url, title, className }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  if (!id) return null;

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-surface",
        className,
      )}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            fill
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-background/30 transition-colors group-hover:bg-background/15" />
          <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/40 transition-transform group-hover:scale-110">
            <Play className="ml-0.5 size-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
