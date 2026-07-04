/**
 * Schema registry for the admin content editors.
 *
 * Every editable table is described here once — the list pages, forms, and
 * server actions all read these definitions, so adding a field to the site
 * means adding one line here rather than a new page.
 */

export type FieldType =
  | "text"      // single-line input
  | "textarea"  // multi-line plain text
  | "html"      // rich text stored as HTML (edited as text for now)
  | "number"
  | "boolean"
  | "select"
  | "tags"      // text[] edited as comma-separated
  | "list"      // text[] edited as one-item-per-line
  | "month"     // "YYYY-MM" string
  | "date"      // "YYYY-MM-DD" string
  | "image"     // single upload → public URL
  | "images"    // multiple uploads → text[] of URLs
  | "file"      // any-file upload → public URL
  | "rows"      // jsonb array of small objects, edited as a repeatable grid
  | "color";

export interface SubfieldDef {
  name: string;
  label: string;
  type: "text" | "number";
  placeholder?: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  /** For "select" */
  options?: string[];
  /** For "rows" */
  subfields?: SubfieldDef[];
  /** For "image"/"images"/"file" — storage bucket (default "media") */
  bucket?: "media" | "documents";
  /** For "file" — accept attribute */
  accept?: string;
  /** Store empty string as null (nullable text columns) */
  emptyToNull?: boolean;
  /** For "textarea"/"html" — visible rows */
  rows?: number;
}

export interface CollectionDef {
  key: string;
  table: string;
  label: string;
  itemLabel: string;
  description: string;
  /** Row field shown as the list item title */
  titleField: string;
  /** Optional secondary line in the list */
  subtitleField?: string;
  reorderable: boolean;
  orderBy: { column: string; ascending: boolean };
  fields: FieldDef[];
}

const bySortOrder = { column: "sort_order", ascending: true } as const;

/** Singleton editors (single-row tables, id = 1). */
export const SINGLETONS: Record<string, { table: string; label: string; description: string; fields: FieldDef[] }> = {
  profile: {
    table: "profile",
    label: "Profile",
    description: "Your name, bio, photo, resume, and social links — powers the hero and about sections.",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      {
        name: "roles", label: "Roles (typewriter)", type: "tags", required: true,
        hint: "Comma-separated — the hero cycles through these.",
        placeholder: "Full-Stack Developer, Software Engineer",
      },
      { name: "tagline", label: "Tagline", type: "textarea", rows: 2, required: true },
      {
        name: "bio", label: "Bio (HTML)", type: "html", rows: 8, required: true,
        hint: "Wrap paragraphs in <p>…</p> tags.",
      },
      {
        name: "quick_facts", label: "Quick facts", type: "rows",
        subfields: [
          { name: "label", label: "Label", type: "text", placeholder: "Degree" },
          { name: "value", label: "Value", type: "text", placeholder: "BSc in Computer Engineering" },
        ],
      },
      {
        name: "currently_learning", label: "Currently learning", type: "tags",
        placeholder: "Next.js, TensorFlow, System Design",
      },
      { name: "avatar_url", label: "Profile photo", type: "image" },
      {
        name: "resume_url", label: "Resume / CV (PDF)", type: "file",
        bucket: "documents", accept: "application/pdf",
        hint: "Shown as the résumé download button.",
      },
      { name: "email", label: "Public email", type: "text", required: true },
      { name: "location", label: "Location", type: "text", placeholder: "Kandy, Sri Lanka" },
      {
        name: "socials", label: "Social links", type: "rows",
        subfields: [
          { name: "platform", label: "Platform", type: "text", placeholder: "GitHub" },
          { name: "url", label: "URL", type: "text", placeholder: "https://github.com/…" },
        ],
        hint: "Platforms with icons: GitHub, LinkedIn, X/Twitter, YouTube, Instagram, Facebook.",
      },
    ],
  },
  settings: {
    table: "site_settings",
    label: "Site settings",
    description: "Global SEO and appearance settings.",
    fields: [
      { name: "site_title", label: "Site title", type: "text", required: true, hint: "Browser tab + search results." },
      { name: "meta_description", label: "Meta description", type: "textarea", rows: 3, required: true },
      { name: "og_image_url", label: "Social share image", type: "image", hint: "Shown when the site is shared. 1200×630 works best." },
      { name: "accent_color", label: "Accent color", type: "color", hint: "Stored now — applied site-wide in the polish phase." },
    ],
  },
};

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "projects", table: "projects", label: "Projects", itemLabel: "project",
    description: "Your project showcase — drafts stay hidden until published.",
    titleField: "title", subtitleField: "slug",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug", label: "Slug", type: "text", required: true,
        placeholder: "my-project", hint: "URL path: /projects/<slug> — lowercase, hyphens, unique.",
      },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, required: true, hint: "One or two lines for the project card." },
      { name: "description", label: "Description (HTML)", type: "html", rows: 10, hint: "Full case study — wrap paragraphs in <p>…</p>." },
      { name: "cover_url", label: "Cover image", type: "image" },
      { name: "gallery", label: "Gallery images", type: "images" },
      { name: "tech", label: "Tech stack", type: "tags", placeholder: "Next.js, TypeScript, Supabase" },
      { name: "youtube_url", label: "YouTube demo URL", type: "text", emptyToNull: true, placeholder: "https://youtube.com/watch?v=…" },
      { name: "github_url", label: "GitHub URL", type: "text", emptyToNull: true },
      { name: "live_url", label: "Live demo URL", type: "text", emptyToNull: true },
      { name: "featured", label: "Featured (large card)", type: "boolean" },
      { name: "published", label: "Published (visible to visitors)", type: "boolean" },
    ],
  },
  {
    key: "blogs", table: "blog_posts", label: "Blog posts", itemLabel: "post",
    description: "Write posts here, or link out to Medium/Dev.to.",
    titleField: "title", subtitleField: "published_at",
    reorderable: false, orderBy: { column: "published_at", ascending: false },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, hint: "URL path: /blog/<slug> — lowercase, hyphens, unique." },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, required: true },
      {
        name: "content", label: "Content (HTML)", type: "html", rows: 14, emptyToNull: true,
        hint: "Leave empty if the post lives elsewhere and set the external URL instead.",
      },
      { name: "external_url", label: "External URL", type: "text", emptyToNull: true, placeholder: "https://medium.com/@you/…" },
      { name: "cover_url", label: "Cover image", type: "image" },
      { name: "tags", label: "Tags", type: "tags", placeholder: "React, Next.js" },
      { name: "published_at", label: "Publish date", type: "date", required: true },
      { name: "published", label: "Published (visible to visitors)", type: "boolean" },
    ],
  },
  {
    key: "education", table: "education", label: "Education", itemLabel: "entry",
    description: "Degrees, school, and courses on the timeline.",
    titleField: "institution", subtitleField: "field",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "degree", label: "Degree / level", type: "text", placeholder: "BSc" },
      { name: "field", label: "Field of study", type: "text", placeholder: "Computer Engineering" },
      { name: "start_date", label: "Start", type: "month", required: true },
      { name: "end_date", label: "End", type: "month", emptyToNull: true, hint: "Leave empty for “Present”." },
      { name: "grade", label: "Grade / result", type: "text", emptyToNull: true, placeholder: "GPA 3.8 / 4.0" },
      { name: "logo_url", label: "Logo", type: "image" },
      { name: "highlights", label: "Highlights", type: "list", hint: "One per line." },
    ],
  },
  {
    key: "skills", table: "skill_categories", label: "Skills", itemLabel: "category",
    description: "Skill categories with per-skill proficiency levels.",
    titleField: "name",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "name", label: "Category name", type: "text", required: true, placeholder: "Frontend" },
      {
        name: "skills", label: "Skills", type: "rows",
        subfields: [
          { name: "name", label: "Skill", type: "text", placeholder: "React" },
          { name: "icon", label: "Icon (optional)", type: "text" },
          { name: "level", label: "Level %", type: "number", placeholder: "85" },
        ],
      },
    ],
  },
  {
    key: "experience", table: "experience", label: "Experience", itemLabel: "role",
    description: "Internships and work experience.",
    titleField: "company", subtitleField: "role",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "company", label: "Company", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: ["internship", "work"] },
      { name: "location", label: "Location", type: "text" },
      { name: "start_date", label: "Start", type: "month", required: true },
      { name: "end_date", label: "End", type: "month", emptyToNull: true, hint: "Leave empty for “Present”." },
      { name: "bullets", label: "What you did", type: "list", hint: "One achievement per line." },
      { name: "logo_url", label: "Company logo", type: "image" },
    ],
  },
  {
    key: "publications", table: "publications", label: "Publications", itemLabel: "publication",
    description: "Research papers and articles.",
    titleField: "title", subtitleField: "venue",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "authors", label: "Authors", type: "tags", hint: "Comma-separated, in order." },
      { name: "venue", label: "Venue", type: "text", placeholder: "Conference / journal name" },
      { name: "year", label: "Year", type: "number", required: true },
      { name: "abstract", label: "Abstract", type: "textarea", rows: 5 },
      { name: "link", label: "Link (DOI / page)", type: "text", emptyToNull: true },
      { name: "pdf_url", label: "PDF", type: "file", bucket: "documents", accept: "application/pdf" },
      { name: "type", label: "Type", type: "select", options: ["conference", "journal", "preprint", "thesis", "other"] },
    ],
  },
  {
    key: "certifications", table: "certifications", label: "Certifications", itemLabel: "certification",
    description: "Courses and certificates, with optional proof files.",
    titleField: "title", subtitleField: "issuer",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Issuer", type: "text", placeholder: "Coursera · DeepLearning.AI" },
      { name: "issue_date", label: "Issued", type: "month" },
      { name: "credential_id", label: "Credential ID", type: "text", emptyToNull: true },
      { name: "credential_url", label: "Verify URL", type: "text", emptyToNull: true },
      { name: "file_url", label: "Certificate file", type: "file", accept: "image/*,application/pdf" },
      { name: "skills", label: "Skills covered", type: "tags" },
    ],
  },
  {
    key: "achievements", table: "achievements", label: "Achievements", itemLabel: "achievement",
    description: "Awards, hackathon wins, and recognitions.",
    titleField: "title", subtitleField: "issuer",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
      { name: "date", label: "Date", type: "month" },
      { name: "issuer", label: "Issuer", type: "text", emptyToNull: true },
      { name: "image_url", label: "Photo", type: "image" },
      { name: "category", label: "Category", type: "select", options: ["award", "hackathon", "competition", "scholarship", "other"] },
    ],
  },
  {
    key: "coding-profiles", table: "coding_profiles", label: "Coding profiles", itemLabel: "profile",
    description: "GitHub, LeetCode, HackerRank and friends.",
    titleField: "platform", subtitleField: "username",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true, placeholder: "GitHub" },
      { name: "username", label: "Username", type: "text", required: true },
      { name: "url", label: "Profile URL", type: "text", required: true },
    ],
  },
  {
    key: "testimonials", table: "testimonials", label: "Testimonials", itemLabel: "testimonial",
    description: "Quotes from lecturers, mentors, and teammates.",
    titleField: "name", subtitleField: "role",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", placeholder: "Senior Lecturer" },
      { name: "company", label: "Company / institution", type: "text", emptyToNull: true },
      { name: "avatar_url", label: "Photo", type: "image" },
      { name: "quote", label: "Quote", type: "textarea", rows: 4, required: true },
    ],
  },
  {
    key: "stats", table: "stats", label: "Stats", itemLabel: "stat",
    description: "The animated counters in the highlights strip.",
    titleField: "label", subtitleField: "value",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "label", label: "Label", type: "text", required: true, placeholder: "GitHub Repos" },
      { name: "value", label: "Value", type: "number", required: true },
      { name: "suffix", label: "Suffix", type: "text", placeholder: "+", hint: "Shown after the number, e.g. “+”." },
    ],
  },
  {
    key: "volunteering", table: "volunteering", label: "Volunteering", itemLabel: "entry",
    description: "Leadership and community roles.",
    titleField: "organization", subtitleField: "role",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "organization", label: "Organization", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "start_date", label: "Start", type: "month", required: true },
      { name: "end_date", label: "End", type: "month", emptyToNull: true, hint: "Leave empty for “Present”." },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
    ],
  },
  {
    key: "gallery", table: "gallery", label: "Gallery", itemLabel: "photo",
    description: "Event photos, workshops, and moments.",
    titleField: "caption",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "image_url", label: "Photo", type: "image", required: true },
      { name: "caption", label: "Caption", type: "text", emptyToNull: true },
    ],
  },
  {
    key: "languages", table: "languages", label: "Languages", itemLabel: "language",
    description: "Spoken languages and proficiency.",
    titleField: "name", subtitleField: "proficiency",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "name", label: "Language", type: "text", required: true },
      { name: "proficiency", label: "Proficiency", type: "text", required: true, placeholder: "Professional working" },
    ],
  },
  {
    key: "services", table: "services", label: "Services", itemLabel: "service",
    description: "What you offer for freelance work.",
    titleField: "title",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 3, required: true },
      { name: "icon", label: "Icon name", type: "text", emptyToNull: true, hint: "Optional — a lucide icon name like “code” or “palette”." },
    ],
  },
  {
    key: "faqs", table: "faqs", label: "FAQ", itemLabel: "question",
    description: "Common questions and your answers.",
    titleField: "question",
    reorderable: true, orderBy: bySortOrder,
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", rows: 4, required: true },
    ],
  },
];

export function getCollection(key: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.key === key);
}

/** Blank values for a "new item" form. */
export function buildDefaults(fields: FieldDef[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    switch (f.type) {
      case "boolean":
        out[f.name] = false;
        break;
      case "number":
        out[f.name] = 0;
        break;
      case "select":
        out[f.name] = f.options?.[0] ?? "";
        break;
      case "tags":
      case "list":
      case "images":
      case "rows":
        out[f.name] = [];
        break;
      case "image":
      case "file":
        out[f.name] = null;
        break;
      case "color":
        out[f.name] = "#7c3aed";
        break;
      default:
        out[f.name] = "";
    }
  }
  return out;
}
