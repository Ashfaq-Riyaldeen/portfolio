import { Section, SectionHeading } from "@/components/ui/section";
import { getProjects, type SectionConfig } from "@/lib/content";
import { ProjectsClient } from "./projects-client";

export async function Projects({ config }: { config: SectionConfig }) {
  const projects = await getProjects();
  if (projects.length === 0) return null;

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="projects"
        title={config.title}
        lead="Things I've designed, built, broken, and rebuilt. Filter by technology, or open any card for the full story."
      />
      <ProjectsClient projects={projects} />
    </Section>
  );
}
