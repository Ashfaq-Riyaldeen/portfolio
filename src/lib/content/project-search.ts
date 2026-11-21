import type { Project } from "./types";

export const PROJECT_CATEGORIES = [
  "Full Stack",
  "AI & ML",
  "Data & Analytics",
  "Cloud & DevOps",
  "Systems & Security",
  "Mobile & Hardware",
] as const;

export function filterProjects(projects: Project[], category: string, query: string) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return projects.filter((project) => {
    if (!project.published) return false;
    if (category !== "All" && !project.categories.includes(category)) return false;
    const searchable = [project.title, project.summary, ...project.tech, ...project.categories]
      .join(" ").toLocaleLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
}
