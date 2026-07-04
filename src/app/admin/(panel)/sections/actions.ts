"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SectionUpdate {
  key: string;
  visible: boolean;
  sortOrder: number;
}

export async function saveSections(
  updates: SectionUpdate[],
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  // Server actions are reachable by direct POST — always re-check auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const results = await Promise.all(
    updates.map((u) =>
      supabase
        .from("sections")
        .update({ visible: u.visible, sort_order: u.sortOrder })
        .eq("key", u.key),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  // Publish immediately: rebuild every public page from fresh data.
  revalidatePath("/", "layout");
  return { error: null };
}
