import { Section, SectionHeading } from "@/components/ui/section";
import { getProjects, type SectionConfig } from "@/lib/content";
import { ProjectsClient } from "./projects-client";
import Link from "next/link";

export async function Projects({ config }: { config: SectionConfig }) {
  const projects = await getProjects();
  if (projects.length === 0) return null;
  const featured = projects.filter((project) => project.featured);

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="projects"
        title={config.title}
        lead="Selected work across full-stack applications, cloud platforms, AI, data pipelines, and computer engineering research."
      />
      <ProjectsClient projects={featured.length ? featured : projects.slice(0, 6)} />
      <div className="mt-10 text-center">
        <Link href="/projects" className="inline-flex rounded-full border border-secondary/40 px-6 py-3 text-base font-medium text-secondary transition-colors hover:bg-secondary/10">
          Explore all {projects.length} projects
        </Link>
      </div>
    </Section>
  );
}
