"use server";

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

export async function setMessageRead(id: string, read: boolean): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("messages").update({ read }).eq("id", id);
    return error ? { error: error.message } : {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("messages").delete().eq("id", id);
    return error ? { error: error.message } : {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
