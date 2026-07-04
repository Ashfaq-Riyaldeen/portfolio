"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt angle in degrees. */
  angle?: number;
}

/** Card that tilts in 3D toward the cursor. */
export function TiltCard({ children, className, angle = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * angle);
    rx.set(-py * angle);
  }

  function onPointerLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div
      ref={ref}
      style={{ perspective: 1000 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("h-full", className)}
    >
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
