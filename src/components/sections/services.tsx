import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { getServices, type SectionConfig } from "@/lib/content";

export async function Services({ config }: { config: SectionConfig }) {
  const services = await getServices();
  if (services.length === 0) return null;

  return (
    <Section id="services">
      <SectionHeading eyebrow="services" title={config.title} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.07}>
            <div className="glass group h-full rounded-2xl p-7 transition-all hover:bg-white/6 hover:glow-primary">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 text-primary-bright">
                <Sparkles className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
