"use server";

import { getCollection, SINGLETONS } from "@/lib/admin/collections";
import { publishContent } from "@/lib/admin/publish";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
  warning?: string;
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
    for (const field of fields) {
      if (field.type === "number" && field.name in payload && !Number.isFinite(payload[field.name])) {
        return { error: `${field.label} must be a valid number.` };
      }
    }

    if (singleton) {
      const { error, data } = await supabase.from(table).update(payload).eq("id", 1).select("id").single();
      if (error) return { error: error.message };
      if (!data) return { error: "The record no longer exists. Refresh and try again." };
    } else if (id) {
      const { error, data } = await supabase.from(table).update(payload).eq("id", id).select("id").single();
      if (error) return { error: error.message };
      if (!data) return { error: "The record no longer exists. Refresh and try again." };
    } else {
      if (def!.reorderable) {
        const { data, error } = await supabase
          .from(table)
          .select("sort_order")
          .order("sort_order", { ascending: false })
          .limit(1);
        if (error) return { error: error.message };
        payload.sort_order = (data?.[0]?.sort_order ?? 0) + 1;
      }
      const { error } = await supabase.from(table).insert(payload);
      if (error) return { error: error.message };
    }

    return await publishContent();
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

    return await publishContent();
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

    return await publishContent();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
