import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SectionsManager, type SectionItem } from "./sections-client";
import { readContentState, type SectionKey } from "@/lib/content";
import { sectionHasContent } from "@/lib/content/sections";

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
  const { data: content } = await readContentState(true);

  const items: SectionItem[] = ((data ?? []) as SectionRow[]).map((r) => ({
    key: r.key,
    title: r.title,
    visible: r.visible,
    hasContent: content.sections.some((section) => section.key === r.key) && sectionHasContent(r.key as SectionKey, content),
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
        Navigation and footer links follow the same order. Empty sections appear after content is added.
      </p>

      <div className="mt-8">
        <SectionsManager initial={items} />
      </div>
    </div>
  );
}
