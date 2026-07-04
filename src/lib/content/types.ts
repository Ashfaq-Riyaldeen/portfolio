/**
 * Content model for the portfolio.
 * Mirrors the Supabase schema (PROJECT_SPEC.md §8) — the local seed data and,
 * later, the database rows both conform to these types, so components never
 * care where content comes from.
 */

export type SectionKey =
  | "hero"
  | "about"
  | "stats"
  | "resume"
  | "education"
  | "skills"
  | "projects"
  | "publications"
  | "experience"
  | "certifications"
  | "achievements"
  | "coding-profiles"
  | "blogs"
  | "testimonials"
  | "volunteering"
  | "gallery"
  | "languages"
  | "services"
  | "faq"
  | "contact";

export interface SectionConfig {
  key: SectionKey;
  /** Heading shown on the page, e.g. "Technical Skills" */
  title: string;
  /** Short label used in the navbar, e.g. "Skills" */
  navLabel: string;
  visible: boolean;
  sortOrder: number;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Profile {
  name: string;
  /** Cycled by the hero typewriter */
  roles: string[];
  tagline: string;
  /** Rich text (HTML) shown in About */
  bio: string;
  quickFacts: { label: string; value: string }[];
  currentlyLearning: string[];
  avatarUrl: string | null;
  resumeUrl: string | null;
  email: string;
  location: string;
  socials: SocialLink[];
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  ogImageUrl: string | null;
  accentColor: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  /** "YYYY-MM" */
  startDate: string;
  /** null = present */
  endDate: string | null;
  grade: string | null;
  logoUrl: string | null;
  highlights: string[];
}

export interface SkillCategory {
  name: string;
  skills: { name: string; icon: string | null; level: number | null }[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  /** Rich text (HTML) for the detail page */
  description: string;
  coverUrl: string | null;
  gallery: string[];
  tech: string[];
  youtubeUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  published: boolean;
}

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  link: string | null;
  pdfUrl: string | null;
  type: "journal" | "conference" | "preprint" | "thesis" | "other";
}

export interface ExperienceEntry {
  company: string;
  role: string;
  type: "work" | "internship";
  location: string;
  startDate: string;
  endDate: string | null;
  bullets: string[];
  logoUrl: string | null;
}

export interface Certification {
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string | null;
  credentialUrl: string | null;
  /** Image or PDF of the certificate itself */
  fileUrl: string | null;
  skills: string[];
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
  issuer: string | null;
  imageUrl: string | null;
  category: "award" | "hackathon" | "competition" | "scholarship" | "other";
}

export interface CodingProfile {
  platform: string;
  username: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Rich text (HTML); null when the post lives elsewhere */
  content: string | null;
  /** Set when the post is on Medium/Dev.to/etc. */
  externalUrl: string | null;
  coverUrl: string | null;
  tags: string[];
  published: boolean;
  publishedAt: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string | null;
  avatarUrl: string | null;
  quote: string;
}

export interface VolunteeringEntry {
  organization: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface GalleryItem {
  imageUrl: string;
  caption: string | null;
}

export interface LanguageEntry {
  name: string;
  proficiency: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string | null;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** Everything the public site needs, in one bundle. */
export interface SiteContent {
  profile: Profile;
  settings: SiteSettings;
  sections: SectionConfig[];
  stats: Stat[];
  education: EducationEntry[];
  skillCategories: SkillCategory[];
  projects: Project[];
  publications: Publication[];
  experience: ExperienceEntry[];
  certifications: Certification[];
  achievements: Achievement[];
  codingProfiles: CodingProfile[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  volunteering: VolunteeringEntry[];
  gallery: GalleryItem[];
  languages: LanguageEntry[];
  services: Service[];
  faqs: FaqEntry[];
}
