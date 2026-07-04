import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { getLanguages, type SectionConfig } from "@/lib/content";

export async function Languages({ config }: { config: SectionConfig }) {
  const languages = await getLanguages();
  if (languages.length === 0) return null;

  return (
    <Section id="languages">
      <SectionHeading eyebrow="languages" title={config.title} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {languages.map((language, i) => (
          <Reveal key={language.name} delay={i * 0.06}>
            <div className="glass rounded-2xl px-5 py-6 text-center transition-colors hover:bg-white/6">
              <p className="font-display text-lg font-semibold text-foreground">
                {language.name}
              </p>
              <p className="mt-1 font-mono text-xs text-secondary">
                {language.proficiency}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
