"use server";

import { publishContent } from "@/lib/admin/publish";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SectionUpdate {
  key: string;
  visible: boolean;
  sortOrder: number;
}

export async function saveSections(
  updates: SectionUpdate[],
): Promise<{ error: string | null; warning?: string }> {
  const supabase = await createSupabaseServerClient();

  // Server actions are reachable by direct POST — always re-check auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  if (!Array.isArray(updates) || updates.length === 0 || updates.some((u, i) =>
    !u || typeof u.key !== "string" || typeof u.visible !== "boolean" || u.sortOrder !== i + 1
  ) || new Set(updates.map((u) => u.key)).size !== updates.length) {
    return { error: "Invalid section layout. Refresh and try again." };
  }

  const { error } = await supabase.rpc("save_section_layout", { updates });
  if (error) return { error: error.code === "PGRST202"
    ? "Apply the pending admin controls migration in Supabase before saving section layouts."
    : error.message };

  // Publish immediately: rebuild every public page from fresh data.
  return { error: null, ...await publishContent() };
}
