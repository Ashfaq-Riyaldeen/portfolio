import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { seed } from "../src/lib/content/seed.ts";
import { filterProjects, PROJECT_CATEGORIES } from "../src/lib/content/project-search.ts";
import { formatMonth } from "../src/lib/utils.ts";

test("catalogue covers the approved projects without duplicates or unsupported completion claims", () => {
  assert.equal(seed.projects.length, 20);
  assert.equal(new Set(seed.projects.map((p) => p.slug)).size, 20);
  assert.deepEqual(seed.projects.filter((p) => p.featured).map((p) => p.slug), [
    "dn-dental-clinic", "playarena", "choojava", "prexon", "hospital-vitals", "fazd-sdvn",
  ]);
  for (const project of seed.projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(project.categories.every((category) => PROJECT_CATEGORIES.includes(category)));
    assert.ok(project.description.includes("Project scope"));
    if (project.githubUrl) assert.equal(new URL(project.githubUrl).hostname, "github.com");
  }
  assert.match(seed.projects.find((p) => p.slug === "gland-segmentation-proposal").summary, /proposal/);
  assert.match(seed.projects.find((p) => p.slug === "hospital-vitals").description, /simulated/);
  assert.match(seed.projects.find((p) => p.slug === "playarena").description, /mocked/);
  assert.match(seed.projects.find((p) => p.slug === "choojava").description, /torn down/);
});

test("project search combines case-insensitive words, categories, and publication state", () => {
  assert.deepEqual(filterProjects(seed.projects, "AI & ML", "  NEXT.JS   FastAPI  ").map((p) => p.slug), ["prexon"]);
  assert.deepEqual(filterProjects(seed.projects, "Data & Analytics", "spark").map((p) => p.slug), ["hospital-vitals"]);
  assert.equal(filterProjects(seed.projects, "Mobile & Hardware", "spring").length, 0);
  assert.equal(filterProjects(seed.projects, "All", " ").length, 20);
  assert.equal(filterProjects([{...seed.projects[0], published:false}], "All", "").length, 0);
});

test("profile, experience, qualifications and public sections reflect the supplied records", () => {
  assert.equal(seed.profile.email, "ashfaq.riyaldeen@gmail.com");
  assert.equal(seed.profile.location, "Colombo, Sri Lanka");
  assert.deepEqual(seed.profile.roles, ["Software Engineer", "Full Stack Developer"]);
  assert.equal(seed.education[0].endDate, "2026-10");
  assert.deepEqual(seed.experience.map((entry) => entry.type), ["part-time", "internship", "university-project"]);
  assert.equal(seed.experience[2].endDate, "2025-03");
  assert.equal(seed.certifications.length, 6);
  assert.ok(seed.certifications.every((cert) => cert.issueDate === "" && cert.credentialUrl));
  assert.equal(seed.achievements.length, 2);
  assert.ok(seed.achievements.every((award) => award.date === "2025" && award.title.startsWith("Finalist")));
  assert.ok(seed.skillCategories.flatMap((category) => category.skills).every((skill) => skill.level === null));
  assert.deepEqual(seed.blogPosts, []);
  assert.deepEqual(seed.testimonials, []);
  for (const key of ["blogs", "testimonials", "services", "faq", "gallery"]) assert.equal(seed.sections.find((section) => section.key === key).visible, false);
  assert.match(seed.publications[0].abstract, /not a peer-reviewed publication/);
});

test("date display does not invent months or show blank certificate dates as Present", () => {
  assert.equal(formatMonth("2025"), "2025");
  assert.equal(formatMonth("2026-10"), "Oct 2026");
  assert.equal(formatMonth(""), "");
  assert.equal(formatMonth(null), "Present");
});

test("local CV and portrait exist; supplied PDF is copied without modification", () => {
  const cv = readFileSync(new URL("../public" + seed.profile.resumeUrl, import.meta.url));
  assert.equal(cv.subarray(0, 5).toString(), "%PDF-");
  assert.ok(existsSync(new URL("../public" + seed.profile.avatarUrl, import.meta.url)));
  const original = new URL("../files/Ashfaq_Riyaldeen_CV.pdf", import.meta.url);
  if (existsSync(original)) {
    const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
    assert.equal(hash(cv), hash(readFileSync(original)));
  }
});
