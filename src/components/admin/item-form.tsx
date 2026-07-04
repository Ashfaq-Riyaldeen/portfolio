"use client";

import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveCollectionItem } from "@/app/admin/(panel)/c/actions";
import type { FieldDef } from "@/lib/admin/collections";
import { cn } from "@/lib/utils";
import { MediaUpload, MultiImageUpload } from "./media-upload";

const inputClasses =
  "w-full rounded-xl border border-line bg-white/4 px-4 py-2.5 text-sm text-foreground placeholder:text-subtle focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors";

interface ItemFormProps {
  collectionKey: string;
  /** uuid for existing rows, null for a new row or a singleton */
  id: string | null;
  singleton?: boolean;
  fields: FieldDef[];
  initial: Record<string, unknown>;
  /** List page to return to after saving (collections only) */
  backHref?: string;
  heading: string;
  subheading?: string;
}

/**
 * One form for every editor in the admin panel, rendered from the
 * collection schema in src/lib/admin/collections.ts.
 */
export function ItemForm({
  collectionKey,
  id,
  singleton = false,
  fields,
  initial,
  backHref,
  heading,
  subheading,
}: ItemFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  // tags/list fields are edited as raw text so typing commas/newlines feels natural
  const [textCache, setTextCache] = useState<Record<string, string>>(() => {
    const cache: Record<string, string> = {};
    for (const f of fields) {
      const v = initial[f.name];
      if (f.type === "tags") cache[f.name] = Array.isArray(v) ? v.join(", ") : "";
      if (f.type === "list") cache[f.name] = Array.isArray(v) ? v.join("\n") : "";
    }
    return cache;
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set(name: string, value: unknown) {
    setStatus(null);
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus(null);

    const payload: Record<string, unknown> = { ...values };
    for (const f of fields) {
      if (f.type === "tags") {
        payload[f.name] = (textCache[f.name] ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (f.type === "list") {
        payload[f.name] = (textCache[f.name] ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (f.type === "number") {
        payload[f.name] = Number(payload[f.name]) || 0;
      }
      if (f.emptyToNull && (payload[f.name] === "" || payload[f.name] == null)) {
        payload[f.name] = null;
      }
    }

    startTransition(async () => {
      const result = await saveCollectionItem(collectionKey, id, payload);
      if (result.error) {
        setError(result.error);
      } else if (singleton) {
        setStatus("Saved — the live site is updated.");
        router.refresh();
      } else if (backHref) {
        router.push(backHref);
        router.refresh();
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-subtle transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to list
          </Link>
        ) : null}
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{heading}</h1>
        {subheading ? <p className="mt-2 text-sm text-muted">{subheading}</p> : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`f-${field.name}`}
              className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-subtle"
            >
              {field.label}
              {field.required ? <span className="text-primary"> *</span> : null}
            </label>
            <FieldInput
              field={field}
              value={values[field.name]}
              text={textCache[field.name] ?? ""}
              onChange={(v) => set(field.name, v)}
              onText={(t) => {
                setStatus(null);
                setTextCache((prev) => ({ ...prev, [field.name]: t }));
              }}
            />
            {field.hint ? <p className="mt-1.5 text-xs text-subtle">{field.hint}</p> : null}
          </div>
        ))}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-primary/45 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <div aria-live="polite">
            {error ? (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            ) : status ? (
              <p className="text-sm text-emerald-400">{status}</p>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}

interface FieldInputProps {
  field: FieldDef;
  value: unknown;
  /** Raw text for tags/list fields */
  text: string;
  onChange: (value: unknown) => void;
  onText: (text: string) => void;
}

function FieldInput({ field, value, text, onChange, onText }: FieldInputProps) {
  const id = `f-${field.name}`;

  switch (field.type) {
    case "textarea":
    case "html":
      return (
        <textarea
          id={id}
          required={field.required}
          rows={field.rows ?? 4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={cn(inputClasses, "resize-y font-mono text-xs leading-relaxed")}
        />
      );

    case "number":
      return (
        <input
          id={id}
          type="number"
          required={field.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={cn(inputClasses, "max-w-40")}
        />
      );

    case "boolean": {
      const on = Boolean(value);
      return (
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-labelledby={id}
          onClick={() => onChange(!on)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            on ? "bg-primary" : "bg-white/10",
          )}
        >
          <span
            className={cn(
              "absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform",
              on && "translate-x-5",
            )}
          />
        </button>
      );
    }

    case "select":
      return (
        <select
          id={id}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClasses, "max-w-60 appearance-none bg-surface")}
        >
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "tags":
    case "list":
      return field.type === "tags" ? (
        <input
          id={id}
          required={field.required}
          value={text}
          onChange={(e) => onText(e.target.value)}
          placeholder={field.placeholder ?? "one, two, three"}
          className={inputClasses}
        />
      ) : (
        <textarea
          id={id}
          rows={4}
          value={text}
          onChange={(e) => onText(e.target.value)}
          placeholder={field.placeholder ?? "One item per line"}
          className={cn(inputClasses, "resize-y")}
        />
      );

    case "month":
      return (
        <input
          id={id}
          type="month"
          required={field.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClasses, "max-w-52 [color-scheme:dark]")}
        />
      );

    case "date":
      return (
        <input
          id={id}
          type="date"
          required={field.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClasses, "max-w-52 [color-scheme:dark]")}
        />
      );

    case "color":
      return (
        <div className="flex items-center gap-3">
          <input
            id={id}
            type="color"
            value={String(value ?? "#7c3aed")}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-16 cursor-pointer rounded-lg border border-line bg-transparent"
          />
          <span className="font-mono text-xs text-muted">{String(value ?? "")}</span>
        </div>
      );

    case "image":
    case "file":
      return (
        <MediaUpload
          value={typeof value === "string" && value ? value : null}
          onChange={onChange}
          bucket={field.bucket ?? "media"}
          accept={field.accept ?? (field.type === "image" ? "image/*" : undefined)}
        />
      );

    case "images":
      return (
        <MultiImageUpload
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      );

    case "rows": {
      const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      const subs = field.subfields ?? [];
      return (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-start gap-2">
              <div
                className="grid flex-1 gap-2"
                style={{ gridTemplateColumns: `repeat(${subs.length}, minmax(0, 1fr))` }}
              >
                {subs.map((sub) => (
                  <input
                    key={sub.name}
                    type={sub.type === "number" ? "number" : "text"}
                    aria-label={`${field.label} ${i + 1} — ${sub.label}`}
                    value={String(row[sub.name] ?? "")}
                    placeholder={sub.placeholder ?? sub.label}
                    onChange={(e) => {
                      const next = rows.map((r, j) =>
                        j === i
                          ? {
                              ...r,
                              [sub.name]:
                                sub.type === "number"
                                  ? Number(e.target.value) || 0
                                  : e.target.value,
                            }
                          : r,
                      );
                      onChange(next);
                    }}
                    className={inputClasses}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
                aria-label={`Remove ${field.label} ${i + 1}`}
                className="mt-1.5 rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange([
                ...rows,
                Object.fromEntries(subs.map((s) => [s.name, s.type === "number" ? 0 : ""])),
              ])
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3.5 py-2 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Add row
          </button>
        </div>
      );
    }

    default:
      return (
        <input
          id={id}
          required={field.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClasses}
        />
      );
  }
}
