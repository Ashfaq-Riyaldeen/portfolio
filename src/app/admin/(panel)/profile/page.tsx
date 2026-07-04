import { ItemForm } from "@/components/admin/item-form";
import { SINGLETONS } from "@/lib/admin/collections";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Profile · Admin" };

export default async function ProfileEditorPage() {
  const def = SINGLETONS.profile;
  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase.from(def.table).select("*").eq("id", 1).maybeSingle();

  if (!row) {
    return (
      <p role="alert" className="text-sm text-red-400">
        Profile row not found — run supabase/schema.sql in the Supabase SQL Editor first.
      </p>
    );
  }

  return (
    <ItemForm
      collectionKey="profile"
      id={null}
      singleton
      fields={def.fields}
      initial={row as Record<string, unknown>}
      heading={def.label}
      subheading={def.description}
    />
  );
}
