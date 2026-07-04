"use client";

import { GripVertical } from "lucide-react";
import { Reorder } from "motion/react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { saveSections } from "./actions";

export interface SectionItem {
  key: string;
  title: string;
  visible: boolean;
}

export function SectionsManager({ initial }: { initial: SectionItem[] }) {
  const [items, setItems] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify(items) !== JSON.stringify(baseline);
  const visibleCount = items.filter((it) => it.visible).length;

  function toggle(key: string) {
    setStatus(null);
    setItems((prev) =>
      prev.map((it) =>
        it.key === key ? { ...it, visible: !it.visible } : it,
      ),
    );
  }

  function handleReorder(next: SectionItem[]) {
    setStatus(null);
    setItems(next);
  }

  function handleSave() {
    setError(null);
    setStatus(null);
    startTransition(async () => {
      const result = await saveSections(
        items.map((it, i) => ({
          key: it.key,
          visible: it.visible,
          sortOrder: i + 1,
        })),
      );
      if (result.error) {
        setError(result.error);
      } else {
        setBaseline(items);
        setStatus("Saved — the live site is updated.");
      }
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-subtle">
          {visibleCount} of {items.length} sections visible · drag to reorder
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || pending}
          className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-primary/45 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div aria-live="polite" className="mt-3 min-h-5">
        {error ? (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        ) : status ? (
          <p className="text-sm text-emerald-400">{status}</p>
        ) : dirty ? (
          <p className="text-sm text-amber-300">
            Unsaved changes — the live site still shows the old layout.
          </p>
        ) : null}
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="mt-4 space-y-2"
      >
        {items.map((item, index) => (
          <Reorder.Item
            key={item.key}
            value={item}
            className={cn(
              "glass flex cursor-grab items-center gap-3 rounded-xl px-4 py-3 active:cursor-grabbing",
              !item.visible && "opacity-60",
            )}
          >
            <GripVertical className="size-4 shrink-0 text-subtle" />
            <span className="w-6 shrink-0 font-mono text-[11px] text-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="truncate font-mono text-[10px] text-subtle">
                {item.key}
              </p>
            </div>
            <span
              className={cn(
                "hidden font-mono text-[10px] uppercase tracking-widest sm:block",
                item.visible ? "text-emerald-400" : "text-subtle",
              )}
            >
              {item.visible ? "visible" : "hidden"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={item.visible}
              aria-label={`Toggle ${item.title}`}
              onClick={() => toggle(item.key)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                item.visible ? "bg-primary" : "bg-white/10",
              )}
            >
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform",
                  item.visible && "translate-x-5",
                )}
              />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
