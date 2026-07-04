"use server";

import { revalidatePath } from "next/cache";
import { getCollection, SINGLETONS } from "@/lib/admin/collections";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
}

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  return supabase;
}

/** Keep only columns the collection schema declares — never trust raw client keys. */
function pickPayload(
  fieldNames: string[],
  values: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const name of fieldNames) {
    if (name in values) payload[name] = values[name];
  }
  return payload;
}

export async function saveCollectionItem(
  collectionKey: string,
  id: string | null,
  values: Record<string, unknown>,
): Promise<ActionResult> {
  try {
    const singleton = SINGLETONS[collectionKey];
    const def = getCollection(collectionKey);
    if (!singleton && !def) return { error: "Unknown collection." };

    const supabase = await requireAdmin();
    const table = singleton ? singleton.table : def!.table;
    const fields = singleton ? singleton.fields : def!.fields;
    const payload = pickPayload(fields.map((f) => f.name), values);

    if (singleton) {
      const { error } = await supabase.from(table).update(payload).eq("id", 1);
      if (error) return { error: error.message };
    } else if (id) {
      const { error } = await supabase.from(table).update(payload).eq("id", id);
      if (error) return { error: error.message };
    } else {
      if (def!.reorderable) {
        const { data } = await supabase
          .from(table)
          .select("sort_order")
          .order("sort_order", { ascending: false })
          .limit(1);
        payload.sort_order = (data?.[0]?.sort_order ?? 0) + 1;
      }
      const { error } = await supabase.from(table).insert(payload);
      if (error) return { error: error.message };
    }

    revalidatePath("/", "layout");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteCollectionItem(
  collectionKey: string,
  id: string,
): Promise<ActionResult> {
  try {
    const def = getCollection(collectionKey);
    if (!def) return { error: "Unknown collection." };

    const supabase = await requireAdmin();
    const { error } = await supabase.from(def.table).delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function reorderCollection(
  collectionKey: string,
  ids: string[],
): Promise<ActionResult> {
  try {
    const def = getCollection(collectionKey);
    if (!def?.reorderable) return { error: "Unknown collection." };

    const supabase = await requireAdmin();
    const results = await Promise.all(
      ids.map((id, i) =>
        supabase.from(def.table).update({ sort_order: i + 1 }).eq("id", id),
      ),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) return { error: failed.error.message };

    revalidatePath("/", "layout");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
