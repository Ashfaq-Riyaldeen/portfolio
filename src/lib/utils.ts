import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Extract a YouTube video ID from any common YouTube URL format. */
export function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

/** "2024-06" → "Jun 2024" · null/undefined → "Present" · "" → "" */
export function formatMonth(date?: string | null): string {
  if (date == null) return "Present";
  if (!date.trim()) return "";
  const [year, month] = date.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1).toLocaleString("en", {
    month: "short",
    year: "numeric",
  });
}
