import { Section, SectionHeading } from "@/components/ui/section";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { getVolunteering, type SectionConfig } from "@/lib/content";
import { formatMonth } from "@/lib/utils";

export async function Volunteering({ config }: { config: SectionConfig }) {
  const entries = await getVolunteering();
  if (entries.length === 0) return null;

  const items: TimelineItem[] = entries.map((entry) => ({
    period: `${formatMonth(entry.startDate)} — ${formatMonth(entry.endDate)}`,
    title: entry.role,
    subtitle: entry.organization,
    points: [entry.description],
  }));

  return (
    <Section id="volunteering">
      <SectionHeading eyebrow="volunteering-leadership" title={config.title} />
      <div className="max-w-3xl">
        <Timeline items={items} />
      </div>
    </Section>
  );
}
