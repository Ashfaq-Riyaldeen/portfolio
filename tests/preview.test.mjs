import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { seed } from "../src/lib/content/seed.ts";

// Read-only smoke test against `npm run dev:content` or `npm run start:content`.
const base = process.env.PREVIEW_URL ?? "http://localhost:3000";
const get = (route, options = {}) => fetch(base + route, {...options, signal:AbortSignal.timeout(30000)});
const home = await get("/");
assert.equal(home.status, 200);
const html = await home.text();
assert.ok(html.includes("<title>Ashfaq Riyaldeen</title>"));
assert.ok(html.includes("CGPA") && html.includes("Software Project Experience"));
for (const expected of ["First-Class Honours", "Colombo, Sri Lanka", "ashfaq.riyaldeen@gmail.com", "University client project"]) assert.ok(html.includes(expected), expected);
for (const old of ["Nova — AI Study Assistant", "Pulse — Realtime Chat", "Your University", "Acme Software", "AI / ML Enthusiast"]) assert.ok(!html.includes(old), old + " must be absent");
const section = html.match(/<section id="projects"[\s\S]*?<\/section>/)?.[0];
assert.ok(section);
assert.equal((section.match(/<article\b/g) ?? []).length, 6);
console.log("Homepage: current profile, six featured cards, and no sample content.");

const collection = await get("/projects");
assert.equal(collection.status, 200);
const markup = await collection.text();
assert.equal((markup.match(/<article\b/g) ?? []).length, 20);
assert.ok(markup.includes("Search projects"));
for (const project of seed.projects) assert.ok(markup.includes(`/projects/${project.slug}`), project.slug);
console.log("Collection: 20 rendered project cards and search controls.");

const sitemap = await (await get("/sitemap.xml")).text();
assert.ok(sitemap.includes("/projects</loc>"));
assert.ok(!sitemap.includes("/blog/"));
for (let index = 0; index < seed.projects.length; index += 5) {
  await Promise.all(seed.projects.slice(index, index + 5).map(async (project) => {
    const route = `/projects/${project.slug}`;
    assert.ok(sitemap.includes(`${route}</loc>`));
    const response = await get(route);
    assert.equal(response.status, 200, route);
    const detail = await response.text();
    assert.ok(detail.includes("Project scope"), route);
    assert.ok(!detail.includes("data-project-media"), `${route}: no empty hero media`);
    assert.ok(!detail.includes("data-project-gallery"), `${route}: no empty gallery`);
  }));
}
console.log("All 20 project detail pages: HTTP 200 and included in the sitemap.");

for (const route of ["/projects/nova-ai-study-assistant", "/projects/pulse-realtime-chat", "/projects/trackr-expense-tracker", "/blog/understanding-react-server-components", "/blog/my-first-ml-model-mistakes"]) assert.equal((await get(route)).status, 404, route);
console.log("All retired project/blog URLs: HTTP 404.");

const cv = await get(seed.profile.resumeUrl);
assert.equal(cv.status, 200);
const hash = (value) => createHash("sha256").update(value).digest("hex");
assert.equal(hash(Buffer.from(await cv.arrayBuffer())), hash(readFileSync(new URL("../public" + seed.profile.resumeUrl, import.meta.url))));
assert.equal((await get(seed.profile.avatarUrl)).status, 200);
console.log("CV download matches the packaged original; portrait is accessible.");

const admin = await get("/admin", {redirect:"manual"});
assert.ok([302, 303, 307, 308].includes(admin.status));
assert.ok(admin.headers.get("location").includes("/admin/login"));
console.log("Admin: signed-out access redirects to login.");
