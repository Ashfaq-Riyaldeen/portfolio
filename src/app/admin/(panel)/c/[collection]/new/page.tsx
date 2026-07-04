import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/item-form";
import { buildDefaults, getCollection } from "@/lib/admin/collections";

interface PageProps {
  params: Promise<{ collection: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { collection } = await params;
  const def = getCollection(collection);
  return { title: `New ${def?.itemLabel ?? "item"} · Admin` };
}

export default async function NewItemPage({ params }: PageProps) {
  const { collection } = await params;
  const def = getCollection(collection);
  if (!def) notFound();

  return (
    <ItemForm
      collectionKey={def.key}
      id={null}
      fields={def.fields}
      initial={buildDefaults(def.fields)}
      backHref={`/admin/c/${def.key}`}
      heading={`New ${def.itemLabel}`}
    />
  );
}
