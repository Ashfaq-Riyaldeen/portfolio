import { cache } from "react";
import { seed } from "./seed";
import { fetchSiteContent } from "./supabase";
import type {
  Achievement,
  BlogPost,
  Certification,
  CodingProfile,
  EducationEntry,
  ExperienceEntry,
  FaqEntry,
  GalleryItem,
  LanguageEntry,
  Profile,
  Project,
  Publication,
  SectionConfig,
  Service,
  SiteContent,
  SiteSettings,
  SkillCategory,
  Stat,
  Testimonial,
  VolunteeringEntry,
} from "./types";

export * from "./types";

/**
 * Content access layer.
 *
 * With Supabase env vars present, these getters read from the database;
 * without them (or if the fetch fails, e.g. schema not applied yet) they
 * serve the local seed — the site never breaks, components never change.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const content = cache(async (): Promise<SiteContent> => {
  if (!isSupabaseConfigured) return seed;
  try {
    return await fetchSiteContent();
  } catch (error) {
    console.warn(
      "[content] Supabase fetch failed — serving seed content instead:",
      error instanceof Error ? error.message : error,
    );
    return seed;
  }
});

export async function getProfile(): Promise<Profile> {
  return (await content()).profile;
}

export async function getSettings(): Promise<SiteSettings> {
  return (await content()).settings;
}

export async function getSections(): Promise<SectionConfig[]> {
  const { sections } = await content();
  return [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getVisibleSections(): Promise<SectionConfig[]> {
  return (await getSections()).filter((s) => s.visible);
}

export async function getStats(): Promise<Stat[]> {
  return (await content()).stats;
}

export async function getEducation(): Promise<EducationEntry[]> {
  return (await content()).education;
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  return (await content()).skillCategories;
}

export async function getProjects(): Promise<Project[]> {
  return (await content()).projects.filter((p) => p.published);
}

export async function getProject(slug: string): Promise<Project | null> {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export async function getPublications(): Promise<Publication[]> {
  return (await content()).publications;
}

export async function getExperience(): Promise<ExperienceEntry[]> {
  return (await content()).experience;
}

export async function getCertifications(): Promise<Certification[]> {
  return (await content()).certifications;
}

export async function getAchievements(): Promise<Achievement[]> {
  return (await content()).achievements;
}

export async function getCodingProfiles(): Promise<CodingProfile[]> {
  return (await content()).codingProfiles;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { blogPosts } = await content();
  return blogPosts
    .filter((p) => p.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return (await getBlogPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return (await content()).testimonials;
}

export async function getVolunteering(): Promise<VolunteeringEntry[]> {
  return (await content()).volunteering;
}

export async function getGallery(): Promise<GalleryItem[]> {
  return (await content()).gallery;
}

export async function getLanguages(): Promise<LanguageEntry[]> {
  return (await content()).languages;
}

export async function getServices(): Promise<Service[]> {
  return (await content()).services;
}

export async function getFaqs(): Promise<FaqEntry[]> {
  return (await content()).faqs;
}
