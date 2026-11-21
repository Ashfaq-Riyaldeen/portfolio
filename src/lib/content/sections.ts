import type { SectionConfig, SectionKey, SiteContent } from "./types";

/** The same availability rules drive the homepage, its links, and admin previews. */
export function sectionHasContent(key: SectionKey, content: SiteContent): boolean {
  switch (key) {
    case "hero": case "about": case "contact": return true;
    case "resume": return Boolean(content.profile.resumeUrl);
    case "projects": return content.projects.some((project) => project.published);
    case "blogs": return content.blogPosts.some((post) => post.published);
    case "skills": return content.skillCategories.length > 0;
    case "coding-profiles": return content.codingProfiles.length > 0;
    case "faq": return content.faqs.length > 0;
    default: return content[key].length > 0;
  }
}

export function visibleSections(content: SiteContent): SectionConfig[] {
  return content.sections
    .filter((section) => section.visible && sectionHasContent(section.key, content))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
