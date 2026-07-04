import { Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionList, type CollectionRow } from "@/components/admin/collection-list";
import { getCollection } from "@/lib/admin/collections";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ collection: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { collection } = await params;
  return { title: `${getCollection(collection)?.label ?? "Content"} · Admin` };
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection } = await params;
  const def = getCollection(collection);
  if (!def) notFound();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(def.table)
    .select("*")
    .order(def.orderBy.column, { ascending: def.orderBy.ascending });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{def.label}</h1>
          <p className="mt-2 text-sm text-muted">{def.description}</p>
        </div>
        <Link
          href={`/admin/c/${def.key}/new`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-primary/45"
        >
          <Plus className="size-4" />
          Add {def.itemLabel}
        </Link>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          Couldn&apos;t load {def.label.toLowerCase()}: {error.message}
        </p>
      ) : (
        <CollectionList
          def={{
            key: def.key,
            itemLabel: def.itemLabel,
            titleField: def.titleField,
            subtitleField: def.subtitleField,
            reorderable: def.reorderable,
          }}
          rows={(data ?? []) as CollectionRow[]}
        />
      )}
    </div>
  );
}
