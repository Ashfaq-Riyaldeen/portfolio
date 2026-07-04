import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/item-form";
import { getCollection } from "@/lib/admin/collections";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ collection: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { collection } = await params;
  const def = getCollection(collection);
  return { title: `Edit ${def?.itemLabel ?? "item"} · Admin` };
}

export default async function EditItemPage({ params }: PageProps) {
  const { collection, id } = await params;
  const def = getCollection(collection);
  if (!def) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase
    .from(def.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!row) notFound();

  return (
    <ItemForm
      collectionKey={def.key}
      id={id}
      fields={def.fields}
      initial={row as Record<string, unknown>}
      backHref={`/admin/c/${def.key}`}
      heading={`Edit ${def.itemLabel}`}
      subheading={String(row[def.titleField] ?? "")}
    />
  );
}
