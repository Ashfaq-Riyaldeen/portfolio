import { getStats, type SectionConfig } from "@/lib/content";
import { StatsClient } from "./stats-client";

export async function Stats(_props: { config: SectionConfig }) {
  const stats = await getStats();
  if (stats.length === 0) return null;

  return (
    <section id="stats" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6">
      <StatsClient stats={stats} />
    </section>
  );
}
