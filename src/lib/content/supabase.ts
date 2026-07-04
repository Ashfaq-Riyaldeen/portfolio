import { createClient } from "@supabase/supabase-js";
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
  SectionKey,
  Service,
  SiteContent,
  SiteSettings,
  SkillCategory,
  Stat,
  Testimonial,
  VolunteeringEntry,
} from "./types";

/**
 * Supabase-backed content source (public, read-only).
 *
 * Uses the anon/publishable key — Row Level Security limits it to public
 * content (drafts stay hidden). Postgres columns are snake_case; the mappers
 * below convert rows to the camelCase types the components consume.
 */

/** Keys the section registry knows — unknown DB rows are ignored. */
const SECTION_KEYS = [
  "hero",
  "about",
  "stats",
  "resume",
  "education",
  "skills",
  "projects",
  "publications",
  "experience",
  "certifications",
  "achievements",
  "coding-profiles",
  "blogs",
  "testimonials",
  "volunteering",
  "gallery",
  "languages",
  "services",
  "faq",
  "contact",
] as const satisfies readonly SectionKey[];

const knownSectionKeys = new Set<string>(SECTION_KEYS);

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

// ── Row shapes (mirror supabase/schema.sql) ─────────────────────────

interface ProfileRow {
  name: string;
  roles: string[];
  tagline: string;
  bio: string;
  quick_facts: { label: string; value: string }[];
  currently_learning: string[];
  avatar_url: string | null;
  resume_url: string | null;
  email: string;
  location: string;
  socials: { platform: string; url: string }[];
}

interface SettingsRow {
  site_title: string;
  meta_description: string;
  og_image_url: string | null;
  accent_color: string;
}

interface SectionRow {
  key: string;
  title: string;
  nav_label: string;
  visible: boolean;
  sort_order: number;
}

interface StatRow {
  label: string;
  value: number;
  suffix: string;
}

interface EducationRow {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  grade: string | null;
  logo_url: string | null;
  highlights: string[];
}

interface SkillCategoryRow {
  name: string;
  skills: { name: string; icon: string | null; level: number | null }[];
}

interface ProjectRow {
  slug: string;
  title: string;
  summary: string;
  description: string;
  cover_url: string | null;
  gallery: string[];
  tech: string[];
  youtube_url: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  published: boolean;
}

interface PublicationRow {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  link: string | null;
  pdf_url: string | null;
  type: Publication["type"];
}

interface ExperienceRow {
  company: string;
  role: string;
  type: ExperienceEntry["type"];
  location: string;
  start_date: string;
  end_date: string | null;
  bullets: string[];
  logo_url: string | null;
}

interface CertificationRow {
  title: string;
  issuer: string;
  issue_date: string;
  credential_id: string | null;
  credential_url: string | null;
  file_url: string | null;
  skills: string[];
}

interface AchievementRow {
  title: string;
  description: string;
  date: string;
  issuer: string | null;
  image_url: string | null;
  category: Achievement["category"];
}

interface CodingProfileRow {
  platform: string;
  username: string;
  url: string;
}

interface BlogPostRow {
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  external_url: string | null;
  cover_url: string | null;
  tags: string[];
  published: boolean;
  published_at: string;
}

interface TestimonialRow {
  name: string;
  role: string;
  company: string | null;
  avatar_url: string | null;
  quote: string;
}

interface VolunteeringRow {
  organization: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

interface GalleryRow {
  image_url: string;
  caption: string | null;
}

interface LanguageRow {
  name: string;
  proficiency: string;
}

interface ServiceRow {
  title: string;
  description: string;
  icon: string | null;
}

interface FaqRow {
  question: string;
  answer: string;
}

// ── Query helpers ───────────────────────────────────────────────────

interface QueryResult {
  data: unknown;
  error: { message: string } | null;
}

async function list<T>(query: PromiseLike<QueryResult>): Promise<T[]> {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as T[];
}

async function single<T>(query: PromiseLike<QueryResult>): Promise<T | null> {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as T | null) ?? null;
}

// ── Mappers ─────────────────────────────────────────────────────────

function mapProfile(r: ProfileRow): Profile {
  return {
    name: r.name,
    roles: r.roles ?? [],
    tagline: r.tagline,
    bio: r.bio,
    quickFacts: r.quick_facts ?? [],
    currentlyLearning: r.currently_learning ?? [],
    avatarUrl: r.avatar_url,
    resumeUrl: r.resume_url,
    email: r.email,
    location: r.location,
    socials: r.socials ?? [],
  };
}

function mapSettings(r: SettingsRow): SiteSettings {
  return {
    siteTitle: r.site_title,
    metaDescription: r.meta_description,
    ogImageUrl: r.og_image_url,
    accentColor: r.accent_color,
  };
}

function mapSection(r: SectionRow): SectionConfig {
  return {
    key: r.key as SectionKey,
    title: r.title,
    navLabel: r.nav_label,
    visible: r.visible,
    sortOrder: r.sort_order,
  };
}

function mapEducation(r: EducationRow): EducationEntry {
  return {
    institution: r.institution,
    degree: r.degree,
    field: r.field,
    startDate: r.start_date,
    endDate: r.end_date,
    grade: r.grade,
    logoUrl: r.logo_url,
    highlights: r.highlights ?? [],
  };
}

function mapSkillCategory(r: SkillCategoryRow): SkillCategory {
  return { name: r.name, skills: r.skills ?? [] };
}

function mapProject(r: ProjectRow): Project {
  return {
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    description: r.description,
    coverUrl: r.cover_url,
    gallery: r.gallery ?? [],
    tech: r.tech ?? [],
    youtubeUrl: r.youtube_url,
    githubUrl: r.github_url,
    liveUrl: r.live_url,
    featured: r.featured,
    published: r.published,
  };
}

function mapPublication(r: PublicationRow): Publication {
  return {
    title: r.title,
    authors: r.authors ?? [],
    venue: r.venue,
    year: r.year,
    abstract: r.abstract,
    link: r.link,
    pdfUrl: r.pdf_url,
    type: r.type,
  };
}

function mapExperience(r: ExperienceRow): ExperienceEntry {
  return {
    company: r.company,
    role: r.role,
    type: r.type,
    location: r.location,
    startDate: r.start_date,
    endDate: r.end_date,
    bullets: r.bullets ?? [],
    logoUrl: r.logo_url,
  };
}

function mapCertification(r: CertificationRow): Certification {
  return {
    title: r.title,
    issuer: r.issuer,
    issueDate: r.issue_date,
    credentialId: r.credential_id,
    credentialUrl: r.credential_url,
    fileUrl: r.file_url,
    skills: r.skills ?? [],
  };
}

function mapAchievement(r: AchievementRow): Achievement {
  return {
    title: r.title,
    description: r.description,
    date: r.date,
    issuer: r.issuer,
    imageUrl: r.image_url,
    category: r.category,
  };
}

function mapCodingProfile(r: CodingProfileRow): CodingProfile {
  return { platform: r.platform, username: r.username, url: r.url };
}

function mapBlogPost(r: BlogPostRow): BlogPost {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    externalUrl: r.external_url,
    coverUrl: r.cover_url,
    tags: r.tags ?? [],
    published: r.published,
    publishedAt: r.published_at,
  };
}

function mapTestimonial(r: TestimonialRow): Testimonial {
  return {
    name: r.name,
    role: r.role,
    company: r.company,
    avatarUrl: r.avatar_url,
    quote: r.quote,
  };
}

function mapVolunteering(r: VolunteeringRow): VolunteeringEntry {
  return {
    organization: r.organization,
    role: r.role,
    startDate: r.start_date,
    endDate: r.end_date,
    description: r.description,
  };
}

function mapGalleryItem(r: GalleryRow): GalleryItem {
  return { imageUrl: r.image_url, caption: r.caption };
}

// ── Fetch everything ────────────────────────────────────────────────

export async function fetchSiteContent(): Promise<SiteContent> {
  const db = publicClient();

  const [
    profileRow,
    settingsRow,
    sections,
    stats,
    education,
    skillCategories,
    projects,
    publications,
    experience,
    certifications,
    achievements,
    codingProfiles,
    blogPosts,
    testimonials,
    volunteering,
    gallery,
    languages,
    services,
    faqs,
  ] = await Promise.all([
    single<ProfileRow>(db.from("profile").select("*").limit(1).maybeSingle()),
    single<SettingsRow>(db.from("site_settings").select("*").limit(1).maybeSingle()),
    list<SectionRow>(db.from("sections").select("*").order("sort_order")),
    list<StatRow>(db.from("stats").select("*").order("sort_order")),
    list<EducationRow>(db.from("education").select("*").order("sort_order")),
    list<SkillCategoryRow>(db.from("skill_categories").select("*").order("sort_order")),
    list<ProjectRow>(db.from("projects").select("*").order("sort_order")),
    list<PublicationRow>(db.from("publications").select("*").order("sort_order")),
    list<ExperienceRow>(db.from("experience").select("*").order("sort_order")),
    list<CertificationRow>(db.from("certifications").select("*").order("sort_order")),
    list<AchievementRow>(db.from("achievements").select("*").order("sort_order")),
    list<CodingProfileRow>(db.from("coding_profiles").select("*").order("sort_order")),
    list<BlogPostRow>(db.from("blog_posts").select("*").order("published_at", { ascending: false })),
    list<TestimonialRow>(db.from("testimonials").select("*").order("sort_order")),
    list<VolunteeringRow>(db.from("volunteering").select("*").order("sort_order")),
    list<GalleryRow>(db.from("gallery").select("*").order("sort_order")),
    list<LanguageRow>(db.from("languages").select("*").order("sort_order")),
    list<ServiceRow>(db.from("services").select("*").order("sort_order")),
    list<FaqRow>(db.from("faqs").select("*").order("sort_order")),
  ]);

  if (!profileRow || !settingsRow) {
    throw new Error(
      "Core tables are empty — run supabase/schema.sql in the Supabase SQL Editor",
    );
  }

  return {
    profile: mapProfile(profileRow),
    settings: mapSettings(settingsRow),
    sections: sections
      .filter((r) => knownSectionKeys.has(r.key))
      .map(mapSection),
    stats: stats.map((r): Stat => ({ label: r.label, value: r.value, suffix: r.suffix })),
    education: education.map(mapEducation),
    skillCategories: skillCategories.map(mapSkillCategory),
    projects: projects.map(mapProject),
    publications: publications.map(mapPublication),
    experience: experience.map(mapExperience),
    certifications: certifications.map(mapCertification),
    achievements: achievements.map(mapAchievement),
    codingProfiles: codingProfiles.map(mapCodingProfile),
    blogPosts: blogPosts.map(mapBlogPost),
    testimonials: testimonials.map(mapTestimonial),
    volunteering: volunteering.map(mapVolunteering),
    gallery: gallery.map(mapGalleryItem),
    languages: languages.map((r): LanguageEntry => ({ name: r.name, proficiency: r.proficiency })),
    services: services.map((r): Service => ({ title: r.title, description: r.description, icon: r.icon })),
    faqs: faqs.map((r): FaqEntry => ({ question: r.question, answer: r.answer })),
  };
}
