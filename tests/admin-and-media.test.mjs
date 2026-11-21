import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { seed } from "../src/lib/content/seed.ts";

// Exercise the real server actions/components with isolated framework/DB boundaries.
// No credentials, network calls, or production writes are used by these tests.
const require = createRequire(import.meta.url);
function loadSource(file, mocks, cache = new Map()) {
  file = resolve(file);
  if (cache.has(file)) return cache.get(file);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  cache.set(file, module.exports);
  const localRequire = (name) => {
    if (name in mocks) return mocks[name];
    if (name.startsWith("@/") || name.startsWith(".")) {
      const base = name.startsWith("@/") ? resolve("src", name.slice(2)) : resolve(dirname(file), name);
      const found = [base + ".ts", base + ".tsx", resolve(base, "index.ts")].find(existsSync);
      if (found) return loadSource(found, mocks, cache);
    }
    return require(name);
  };
  new Function("require", "module", "exports", code)(localRequire, module, module.exports);
  return module.exports;
}

test("project details render supplied media and remove the entire empty media area", async () => {
  let project = { ...seed.projects[0] };
  const { default: Page } = loadSource("src/app/(public)/projects/[slug]/page.tsx", {
    "@/lib/content": { getProject: async () => project },
  });
  const { ImageConfigContext } = require("next/dist/shared/lib/image-config-context.shared-runtime");
  const { imageConfigDefault } = require("next/dist/shared/lib/image-config");
  const imageConfig = { ...imageConfigDefault, ...loadSource("next.config.ts", {}).default.images };
  const render = async () => renderToStaticMarkup(React.createElement(ImageConfigContext.Provider, { value: imageConfig }, await Page({ params: Promise.resolve({ slug: project.slug }) })));
  let html = await render();
  assert.ok(!html.includes("data-project-media") && !html.includes("data-project-gallery"));
  assert.ok(!html.includes("<img"));
  project = { ...project, coverUrl: "/provided-project.png", gallery: ["/gallery-project.png"] };
  html = await render();
  assert.ok(html.includes("data-project-media") && html.includes("data-project-gallery"));
  assert.ok(html.includes("provided-project.png") && html.includes("gallery-project.png"));
  project = { ...project, youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" };
  html = await render();
  assert.ok(html.includes("Play video:") && html.includes("provided-project.png"));
  project = { ...project, coverUrl: null, youtubeUrl: null, gallery: [] };
  html = await render();
  assert.ok(!html.includes("data-project-media") && !html.includes("data-project-gallery"));
});

test("uploaded project images never alter the uniform card cover", () => {
  const pass = ({ children }) => React.createElement("div", null, children);
  const { ProjectsClient } = loadSource("src/components/sections/projects-client.tsx", {
    "@/lib/gsap": { ScrollTrigger: { refresh() {} } },
    "@/components/motion/parallax-cover": { ParallaxCover: pass },
    "@/components/motion/scrub": { Scrub: pass },
    "@/components/motion/tilt-card": { TiltCard: pass },
  });
  const project = { ...seed.projects[0], coverUrl: "/provided-project.png" };
  const html = renderToStaticMarkup(React.createElement(ProjectsClient, { projects: [project] }));
  assert.ok(!html.includes("provided-project.png") && !html.includes("<img"));
  assert.ok(html.includes(project.title));
});

function actionFixture({ signedIn = true, writeError = null, warning } = {}) {
  const writes = [];
  let published = 0;
  const client = {
    auth: { getUser: async () => ({ data: { user: signedIn ? { id: "owner" } : null } }) },
    from: (table) => {
      const query = {
        update: (values) => { writes.push({ table, values }); return query; },
        eq: () => query, select: () => query,
        single: async () => ({ data: writeError ? null : { id: "existing" }, error: writeError }),
      };
      return query;
    },
    rpc: async (name, args) => { writes.push({ name, args }); return { error: writeError }; },
  };
  const mocks = {
    "@/lib/supabase/server": { createSupabaseServerClient: async () => client },
    "@/lib/admin/publish": { publishContent: async () => { published++; return warning ? { warning } : {}; } },
  };
  return { mocks, writes, published: () => published };
}

test("admin saves preserve GPA precision and report failed or missing writes without publication", async () => {
  let fixture = actionFixture();
  let actions = loadSource("src/app/admin/(panel)/c/actions.ts", fixture.mocks);
  assert.deepEqual(await actions.saveCollectionItem("stats", "existing", { value: 3.77 }), {});
  assert.equal(fixture.writes[0].values.value, 3.77);
  assert.equal(fixture.published(), 1);
  assert.ok((await actions.saveCollectionItem("stats", "existing", { value: Infinity })).error);
  assert.equal(fixture.writes.length, 1);
  fixture = actionFixture({ writeError: { message: "Record no longer exists" } });
  actions = loadSource("src/app/admin/(panel)/c/actions.ts", fixture.mocks);
  assert.match((await actions.saveCollectionItem("stats", "existing", { value: 3.77 })).error, /no longer exists/);
  assert.equal(fixture.published(), 0);
});

test("signed-out callers cannot save content or layouts; invalid layouts never reach SQL", async () => {
  const fixture = actionFixture({ signedIn: false });
  const actions = loadSource("src/app/admin/(panel)/c/actions.ts", fixture.mocks);
  const sections = loadSource("src/app/admin/(panel)/sections/actions.ts", fixture.mocks);
  assert.match((await actions.saveCollectionItem("profile", null, { name: "Invalid" })).error, /Not signed in/);
  assert.match((await sections.saveSections([])).error, /Not signed in/);
  assert.equal(fixture.writes.length, 0);
  const owner = actionFixture();
  const ownerActions = loadSource("src/app/admin/(panel)/sections/actions.ts", owner.mocks);
  assert.ok((await ownerActions.saveSections([{key:"about",visible:true,sortOrder:1},{key:"about",visible:false,sortOrder:2}])).error);
  assert.equal(owner.writes.length, 0);
  const layout = [{key:"about",visible:false,sortOrder:1}];
  assert.equal((await ownerActions.saveSections(layout)).error, null);
  assert.deepEqual(owner.writes, [{name:"save_section_layout",args:{updates:layout}}]);
});

test("publication expires shared cached content and accurately reports fallback or local preview", async () => {
  const calls = [];
  let source = "supabase";
  const { publishContent } = loadSource("src/lib/admin/publish.ts", {
    "next/cache": { updateTag: (...args) => calls.push(["tag",...args]), revalidatePath: (...args) => calls.push(["path",...args]) },
    "@/lib/content": { readContentState: async (fresh) => { assert.equal(fresh,true); return {source}; } },
  });
  assert.deepEqual(await publishContent(), {});
  assert.deepEqual(calls, [["tag","portfolio-content"],["path","/","layout"]]);
  source = "fallback";
  assert.match((await publishContent()).warning, /Saved to the database.*fallback/);
  source = "local";
  assert.match((await publishContent()).warning, /preview uses local content/);
});
