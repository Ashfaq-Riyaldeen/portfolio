import { ArrowUpRight, FileText } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { getPublications, type SectionConfig } from "@/lib/content";

export async function Publications({ config }: { config: SectionConfig }) {
  const publications = await getPublications();
  if (publications.length === 0) return null;

  return (
    <Section id="publications">
      <SectionHeading eyebrow="research-publications" title={config.title} />

      <div className="max-w-4xl space-y-6">
        {publications.map((pub, i) => (
          <Reveal key={pub.title} delay={i * 0.07}>
            <article className="glass group rounded-2xl p-7 transition-all hover:bg-white/6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-secondary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-secondary">
                  {pub.type}
                </span>
                <span className="font-mono text-sm text-subtle">
                  {pub.year}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                {pub.title}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {pub.authors.join(" · ")}
              </p>
              <p className="mt-1 font-mono text-xs text-primary-bright">
                {pub.venue}
              </p>
              <p className="mt-4 overflow-hidden text-sm leading-relaxed text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                {pub.abstract}
              </p>

              {(pub.link || pub.pdfUrl) && (
                <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-5">
                  {pub.link ? (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-secondary transition-opacity hover:opacity-80"
                    >
                      View Publication
                      <ArrowUpRight className="size-4" />
                    </a>
                  ) : null}
                  {pub.pdfUrl ? (
                    <a
                      href={pub.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                      <FileText className="size-4" />
                      PDF
                    </a>
                  ) : null}
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
