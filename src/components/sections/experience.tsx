import { Section, SectionHeading } from "@/components/ui/section";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { getExperience, type SectionConfig } from "@/lib/content";
import { formatMonth } from "@/lib/utils";

export async function Experience({ config }: { config: SectionConfig }) {
  const entries = await getExperience();
  if (entries.length === 0) return null;

  const items: TimelineItem[] = entries.map((entry) => ({
    period: `${formatMonth(entry.startDate)} — ${formatMonth(entry.endDate)}`,
    title: entry.role,
    subtitle: `${entry.company} · ${entry.location}`,
    badge: entry.type === "internship" ? "Internship" : "Work",
    points: entry.bullets,
  }));

  return (
    <Section id="experience">
      <SectionHeading eyebrow="experience" title={config.title} />
      <div className="max-w-3xl">
        <Timeline items={items} />
      </div>
    </Section>
  );
}
