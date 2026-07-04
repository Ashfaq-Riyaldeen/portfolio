"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";

interface LightboxProps {
  open: boolean;
  src: string | null;
  alt: string;
  onClose: () => void;
}

/** Full-screen image viewer with a spring entrance. */
export function Lightbox({ open, src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && src ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-70 flex items-center justify-center bg-background/90 p-4 backdrop-blur-xl sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            className="glass absolute right-5 top-5 flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/10"
          >
            <X className="size-5" />
          </button>
          <motion.img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="max-h-full max-w-full rounded-2xl border border-line object-contain shadow-2xl shadow-primary/20"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
