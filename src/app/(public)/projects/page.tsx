import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { ProjectsClient } from "@/components/sections/projects-client";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore Ashfaq Riyaldeen's software applications, AI and machine learning projects, data pipelines, cloud platforms, and computer engineering research.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-32">
      <header className="mb-12 max-w-3xl">
        <p className="font-mono text-sm text-secondary">Projects & research</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl"><span className="text-gradient">Ideas put into practice.</span></h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">Client applications, coursework, prototypes, and research. Explore the work by topic, or search for a technology you’re interested in.</p>
      </header>
      <ProjectsClient projects={projects} browse />
    </div>
  );
}
