import {
  Award,
  GraduationCap,
  Rocket,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { getAchievements, type SectionConfig } from "@/lib/content";
import { formatMonth } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  award: Award,
  hackathon: Rocket,
  competition: Trophy,
  scholarship: GraduationCap,
  other: Star,
};

export async function Achievements({ config }: { config: SectionConfig }) {
  const achievements = await getAchievements();
  if (achievements.length === 0) return null;

  return (
    <Section id="achievements">
      <SectionHeading eyebrow="achievements-awards" title={config.title} />

      <div className="grid gap-6 sm:grid-cols-2">
        {achievements.map((achievement, i) => {
          const Icon = categoryIcons[achievement.category] ?? Star;
          return (
            <Reveal key={achievement.title} delay={i * 0.07}>
              <article className="glass group flex h-full gap-5 rounded-2xl p-7 transition-colors hover:bg-white/6">
                <div className="glow-primary flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20">
                  <Icon className="size-5 text-primary-bright" />
                </div>
                <div>
                  <p className="font-mono text-[11px] text-secondary">
                    {formatMonth(achievement.date)}
                    {achievement.issuer ? (
                      <span className="text-subtle">
                        {" "}
                        · {achievement.issuer}
                      </span>
                    ) : null}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-foreground">
                    {achievement.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {achievement.description}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
