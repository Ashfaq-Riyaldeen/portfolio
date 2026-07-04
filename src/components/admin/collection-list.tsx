"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Reorder } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCollectionItem, reorderCollection } from "@/app/admin/(panel)/c/actions";
import type { CollectionDef } from "@/lib/admin/collections";
import { cn } from "@/lib/utils";

export interface CollectionRow {
  id: string;
  [key: string]: unknown;
}

interface CollectionListProps {
  def: Pick<CollectionDef, "key" | "itemLabel" | "titleField" | "subtitleField" | "reorderable">;
  rows: CollectionRow[];
}

/** Item list for a collection: reorder (when allowed), edit, delete. */
export function CollectionList({ def, rows: initial }: CollectionListProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const orderDirty =
    def.reorderable &&
    JSON.stringify(rows.map((r) => r.id)) !== JSON.stringify(baseline.map((r) => r.id));

  function saveOrder() {
    setError(null);
    setStatus(null);
    startTransition(async () => {
      const result = await reorderCollection(def.key, rows.map((r) => r.id));
      if (result.error) {
        setError(result.error);
      } else {
        setBaseline(rows);
        setStatus("Order saved — the live site is updated.");
      }
    });
  }

  function remove(row: CollectionRow) {
    const title = String(row[def.titleField] ?? def.itemLabel);
    if (!window.confirm(`Delete “${title}”? This can't be undone.`)) return;
    setError(null);
    setStatus(null);
    startTransition(async () => {
      const result = await deleteCollectionItem(def.key, row.id);
      if (result.error) {
        setError(result.error);
      } else {
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        setBaseline((prev) => prev.filter((r) => r.id !== row.id));
        router.refresh();
      }
    });
  }

  if (rows.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm text-muted">
          Nothing here yet — add your first {def.itemLabel} with the button above.
        </p>
      </div>
    );
  }

  const rowContent = (row: CollectionRow, index: number) => {
    const subtitle = def.subtitleField ? String(row[def.subtitleField] ?? "") : "";
    const isDraft = "published" in row && !row.published;
    return (
      <>
        {def.reorderable ? (
          <GripVertical className="size-4 shrink-0 text-subtle" />
        ) : (
          <span className="w-6 shrink-0 font-mono text-[11px] text-subtle">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {String(row[def.titleField] ?? "(untitled)")}
            {isDraft ? (
              <span className="ml-2 rounded-full border border-amber-400/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                draft
              </span>
            ) : null}
          </p>
          {subtitle ? (
            <p className="truncate font-mono text-[10px] text-subtle">{subtitle}</p>
          ) : null}
        </div>
        <Link
          href={`/admin/c/${def.key}/${row.id}`}
          aria-label={`Edit ${String(row[def.titleField] ?? def.itemLabel)}`}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <Pencil className="size-4" />
        </Link>
        <button
          type="button"
          onClick={() => remove(row)}
          disabled={pending}
          aria-label={`Delete ${String(row[def.titleField] ?? def.itemLabel)}`}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-red-400 disabled:opacity-50"
        >
          <Trash2 className="size-4" />
        </button>
      </>
    );
  };

  return (
    <div>
      <div aria-live="polite" className="min-h-5">
        {error ? (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        ) : status ? (
          <p className="text-sm text-emerald-400">{status}</p>
        ) : orderDirty ? (
          <p className="text-sm text-amber-300">
            Unsaved order — the live site still shows the old order.
          </p>
        ) : null}
      </div>

      {def.reorderable ? (
        <>
          <Reorder.Group
            axis="y"
            values={rows}
            onReorder={(next: CollectionRow[]) => {
              setStatus(null);
              setRows(next);
            }}
            className="mt-3 space-y-2"
          >
            {rows.map((row, index) => (
              <Reorder.Item
                key={row.id}
                value={row}
                className="glass flex cursor-grab items-center gap-3 rounded-xl px-4 py-3 active:cursor-grabbing"
              >
                {rowContent(row, index)}
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {orderDirty ? (
            <button
              type="button"
              onClick={saveOrder}
              disabled={pending}
              className={cn(
                "mt-4 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-primary/45",
                pending && "cursor-not-allowed opacity-50",
              )}
            >
              {pending ? "Saving…" : "Save order"}
            </button>
          ) : null}
        </>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map((row, index) => (
            <li key={row.id} className="glass flex items-center gap-3 rounded-xl px-4 py-3">
              {rowContent(row, index)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
