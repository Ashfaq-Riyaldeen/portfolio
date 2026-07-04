import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SectionsManager, type SectionItem } from "./sections-client";

export const metadata: Metadata = { title: "Sections" };

interface SectionRow {
  key: string;
  title: string;
  visible: boolean;
}

export default async function SectionsPage() {
  const db = await createSupabaseServerClient();
  const { data, error } = await db
    .from("sections")
    .select("key,title,visible")
    .order("sort_order");
  if (error) throw new Error(error.message);

  const items: SectionItem[] = ((data ?? []) as SectionRow[]).map((r) => ({
    key: r.key,
    title: r.title,
    visible: r.visible,
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-sm text-secondary">{"// sections"}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Page sections
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Toggle what shows on your portfolio and drag sections into the order
        you want. Changes go live the moment you save.
      </p>

      <div className="mt-8">
        <SectionsManager initial={items} />
      </div>
    </div>
  );
}
