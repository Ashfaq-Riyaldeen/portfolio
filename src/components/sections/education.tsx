import { Section, SectionHeading } from "@/components/ui/section";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { getEducation, type SectionConfig } from "@/lib/content";
import { formatMonth } from "@/lib/utils";

export async function Education({ config }: { config: SectionConfig }) {
  const entries = await getEducation();
  if (entries.length === 0) return null;

  const items: TimelineItem[] = entries.map((entry) => ({
    period: `${formatMonth(entry.startDate)} — ${formatMonth(entry.endDate)}`,
    title: `${entry.degree} · ${entry.field}`,
    subtitle: entry.institution,
    badge: entry.grade,
    points: entry.highlights,
  }));

  return (
    <Section id="education">
      <SectionHeading eyebrow="education" title={config.title} />
      <div className="max-w-3xl">
        <Timeline items={items} />
      </div>
    </Section>
  );
}
