import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Scrub } from "@/components/motion/scrub";
import { Section, SectionHeading } from "@/components/ui/section";
import { getProfile, type SectionConfig } from "@/lib/content";

export async function About({ config }: { config: SectionConfig }) {
  const profile = await getProfile();
  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Section id="about">
      <SectionHeading eyebrow="about-me" title={config.title} />

      <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        {/* Portrait (or elegant placeholder until a photo is uploaded) */}
        <Scrub y={56}>
          <Reveal delay={0.1}>
            <div className="mx-auto w-full max-w-sm">
            <div className="glow-primary rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary p-px">
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[calc(1.5rem-1px)] bg-surface">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    sizes="(min-width: 1024px) 320px, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <>
                    <div
                      aria-hidden
                      className="absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
                    />
                    <span className="text-gradient font-display text-8xl font-bold">
                      {initials}
                    </span>
                    <p className="absolute bottom-5 font-mono text-xs text-subtle">
                      {"// photo uploads via admin panel"}
                    </p>
                  </>
                )}
              </div>
            </div>
            </div>
          </Reveal>
        </Scrub>

        <div>
          {/* Bio — authored in the admin panel's rich-text editor */}
          <Reveal delay={0.15}>
            <div
              className="space-y-4 text-base leading-relaxed text-muted sm:text-lg"
              dangerouslySetInnerHTML={{ __html: profile.bio }}
            />
          </Reveal>

          <Scrub y={-24}>
            <Reveal delay={0.2}>
              <dl className="mt-8 grid grid-cols-2 gap-3">
              {profile.quickFacts.map((fact) => (
                <div key={fact.label} className="glass rounded-xl px-4 py-3">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
              </dl>
            </Reveal>
          </Scrub>

          {profile.currentlyLearning.length > 0 && (
            <Reveal delay={0.25}>
              <div className="mt-8">
                <p className="font-mono text-xs text-secondary">
                  {"// currently-learning"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.currentlyLearning.map((topic) => (
                    <span
                      key={topic}
                      className="glass rounded-full px-4 py-1.5 font-mono text-xs text-muted"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
