"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type Bucket = "media" | "documents";

/** Big JPEGs/WebPs are resized to ≤1920px wide before upload; PNGs keep alpha. */
async function compressIfImage(file: File): Promise<Blob> {
  const compressible = ["image/jpeg", "image/webp"].includes(file.type);
  if (!compressible || file.size < 300_000) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1920 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

async function uploadFile(file: File, bucket: Bucket): Promise<string> {
  const supabase = createSupabaseBrowserClient();
  const body = await compressIfImage(file);
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
  const path = `${Date.now()}-${safeName || "file"}`;

  const { error } = await supabase.storage.from(bucket).upload(path, body, {
    contentType: body === file ? file.type : "image/jpeg",
    cacheControl: "31536000",
  });
  if (error) throw new Error(error.message);

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(url) || url.includes("/media/");
}

interface MediaUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: Bucket;
  accept?: string;
}

/** Single file/image picker: drag-drop or click, preview, remove. */
export function MediaUpload({ value, onChange, bucket = "media", accept = "image/*" }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      onChange(await uploadFile(file, bucket));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed — try again.");
    } finally {
      setBusy(false);
    }
  }

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-line bg-white/4 p-3">
        {isImageUrl(value) ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of a just-uploaded file
          <img src={value} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white/5 font-mono text-[10px] uppercase text-subtle">
            file
          </span>
        )}
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 truncate text-xs text-muted underline-offset-2 hover:underline"
        >
          {value.split("/").pop()}
        </a>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-red-400"
          aria-label="Remove file"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-sm transition-colors",
          dragging
            ? "border-primary/70 bg-primary/10 text-foreground"
            : "border-line text-muted hover:border-primary/40 hover:text-foreground",
          busy && "cursor-wait opacity-60",
        )}
      >
        <Upload className="size-4" />
        {busy ? "Uploading…" : "Drop a file here or click to browse"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: Bucket;
}

/** Multi-image picker for project galleries. */
export function MultiImageUpload({ value, onChange, bucket = "media" }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    try {
      const urls = await Promise.all([...files].map((f) => uploadFile(f, bucket)));
      onChange([...value, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {value.length > 0 ? (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative aspect-video overflow-hidden rounded-lg border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview of a just-uploaded file */}
              <img src={url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove image ${i + 1}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-5 text-sm transition-colors",
          dragging
            ? "border-primary/70 bg-primary/10 text-foreground"
            : "border-line text-muted hover:border-primary/40 hover:text-foreground",
          busy && "cursor-wait opacity-60",
        )}
      >
        <Upload className="size-4" />
        {busy ? "Uploading…" : "Add images (drop or click)"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
