import { Section, SectionHeading } from "@/components/ui/section";
import { getSkillCategories, type SectionConfig } from "@/lib/content";
import { SkillsClient } from "./skills-client";

export async function Skills({ config }: { config: SectionConfig }) {
  const categories = await getSkillCategories();
  if (categories.length === 0) return null;

  return (
    <Section id="skills">
      <SectionHeading eyebrow="technical-skills" title={config.title} />
      <SkillsClient categories={categories} />
    </Section>
  );
}
