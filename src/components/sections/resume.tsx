import { ArrowUpRight, Download } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { getProfile, type SectionConfig } from "@/lib/content";

export async function Resume(_props: { config: SectionConfig }) {
  const profile = await getProfile();

  return (
    <Section id="resume" className="py-12 sm:py-16">
      <Reveal>
        <div className="rounded-3xl bg-gradient-to-r from-primary/60 via-accent/50 to-secondary/60 p-px">
          <div className="glass relative overflow-hidden rounded-[calc(1.5rem-1px)] px-8 py-10 sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/25 blur-3xl"
            />
            <div className="relative flex flex-wrap items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="font-mono text-sm text-secondary">
                  {"// resume-cv"}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Prefer the formal version?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                  Everything on this site, condensed to one page — education,
                  skills, projects, and experience.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {profile.resumeUrl ? (
                  <>
                    <Magnetic>
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3.5 font-medium text-white shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/45"
                      >
                        <Download className="size-4" />
                        Download Resume
                      </a>
                    </Magnetic>
                    <Magnetic>
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-foreground transition-colors hover:bg-white/10"
                      >
                        View Online
                        <ArrowUpRight className="size-4" />
                      </a>
                    </Magnetic>
                  </>
                ) : (
                  <div className="text-right">
                    <span className="glass flex cursor-not-allowed items-center gap-2 rounded-full px-7 py-3.5 font-medium text-subtle">
                      <Download className="size-4" />
                      Download Resume
                    </span>
                    <p className="mt-2 font-mono text-[11px] text-subtle">
                      {"// PDF uploads via the admin panel"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
