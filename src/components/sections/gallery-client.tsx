"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Lightbox } from "@/components/ui/lightbox";
import type { GalleryItem } from "@/lib/content";

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [viewer, setViewer] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="columns-2 gap-4 lg:columns-3 [&>*]:mb-4">
        {items.map((item, i) => (
          <Reveal key={item.imageUrl} delay={(i % 6) * 0.05}>
            <button
              type="button"
              onClick={() => setViewer(item)}
              className="group block w-full overflow-hidden rounded-xl border border-line"
              aria-label={item.caption ?? "View photo"}
            >
              {/* Native img: gallery uploads have unknown dimensions, and masonry needs natural aspect ratios */}
              <img
                src={item.imageUrl}
                alt={item.caption ?? ""}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
            </button>
            {item.caption ? (
              <p className="mt-2 px-1 font-mono text-[11px] text-subtle">
                {item.caption}
              </p>
            ) : null}
          </Reveal>
        ))}
      </div>

      <Lightbox
        open={viewer !== null}
        src={viewer?.imageUrl ?? null}
        alt={viewer?.caption ?? "Photo"}
        onClose={() => setViewer(null)}
      />
    </>
  );
}
