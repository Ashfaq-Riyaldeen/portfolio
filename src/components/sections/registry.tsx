import type { ComponentType } from "react";
import type { SectionConfig, SectionKey } from "@/lib/content";
import { About } from "./about";
import { Achievements } from "./achievements";
import { Blogs } from "./blogs";
import { Certifications } from "./certifications";
import { CodingProfiles } from "./coding-profiles";
import { Contact } from "./contact";
import { Education } from "./education";
import { Experience } from "./experience";
import { Faq } from "./faq";
import { Gallery } from "./gallery";
import { Hero } from "./hero";
import { Languages } from "./languages";
import { Projects } from "./projects";
import { Publications } from "./publications";
import { Resume } from "./resume";
import { Services } from "./services";
import { Skills } from "./skills";
import { Stats } from "./stats";
import { Testimonials } from "./testimonials";
import { Volunteering } from "./volunteering";

type SectionComponent = ComponentType<{ config: SectionConfig }>;

/**
 * Maps section keys to their components. The page renders whatever is
 * visible in the content config, in order — so the admin panel's toggles
 * and reordering work without code changes.
 */
export const sectionRegistry: Record<SectionKey, SectionComponent> = {
  hero: Hero,
  about: About,
  stats: Stats,
  resume: Resume,
  education: Education,
  skills: Skills,
  projects: Projects,
  publications: Publications,
  experience: Experience,
  certifications: Certifications,
  achievements: Achievements,
  "coding-profiles": CodingProfiles,
  blogs: Blogs,
  testimonials: Testimonials,
  volunteering: Volunteering,
  gallery: Gallery,
  languages: Languages,
  services: Services,
  faq: Faq,
  contact: Contact,
};

export function isBuilt(key: SectionKey): boolean {
  return key in sectionRegistry;
}
