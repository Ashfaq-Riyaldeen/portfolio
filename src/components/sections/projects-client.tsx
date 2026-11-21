"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Play, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ParallaxCover } from "@/components/motion/parallax-cover";
import { Scrub } from "@/components/motion/scrub";
import { TiltCard } from "@/components/motion/tilt-card";
import { ScrollTrigger } from "@/lib/gsap";
import { PlaceholderCover } from "@/components/ui/placeholder-cover";
import { SocialIcon } from "@/components/ui/social-icon";
import type { Project } from "@/lib/content";
import { filterProjects, PROJECT_CATEGORIES } from "@/lib/content/project-search";
import { cn } from "@/lib/utils";

export function ProjectsClient({ projects, browse = false }: { projects: Project[]; browse?: boolean }) {
  const filters = useMemo(() => {
    const available = new Set(projects.flatMap((p) => p.categories));
    const known = PROJECT_CATEGORIES.filter((category) => available.has(category));
    const extra = [...available].filter((category) => !known.some((item) => item === category)).sort();
    return ["All", ...known, ...extra];
  }, [projects]);

  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const shown = filterProjects(projects, browse ? active : "All", browse ? query : "");

  // Cards re-flow when the filter changes (popLayout); recompute parallax
  // trigger positions once the exit/enter animations have settled.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 450);
    return () => clearTimeout(id);
  }, [active, query]);

  return (
    <>
      {browse && (
      <div className="mb-10 space-y-5">
        <div className="max-w-xl">
          <label htmlFor="project-search" className="mb-2 block text-sm text-muted">Search projects</label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by project, technology, or topic"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-foreground placeholder:text-subtle focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
          />
        </div>
        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter projects by category">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            aria-pressed={active === filter}
            className={cn(
              "rounded-full px-4.5 py-2 text-sm transition-all",
              active === filter
                ? "bg-gradient-to-r from-primary to-secondary font-medium text-white shadow-md shadow-primary/25"
                : "glass text-muted hover:bg-white/8 hover:text-foreground",
            )}
          >
            {filter}
          </button>
        ))}
        </div>
        <p role="status" className="text-sm text-muted">{shown.length} {shown.length === 1 ? "project" : "projects"}</p>
      </div>
      )}

      {shown.length === 0 && (
        <div className="glass rounded-2xl px-6 py-12 text-center">
          <p className="text-muted">No projects match this search.</p>
          <button type="button" onClick={() => { setActive("All"); setQuery(""); }} className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-secondary">Clear filters</button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((project, i) => (
            <motion.article
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Scrub y={i % 2 ? -20 : 28} className="h-full">
              <TiltCard>
                <div className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition-shadow hover:glow-primary">
                  {/* Cover */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="relative block aspect-video overflow-hidden"
                  >
                    <ParallaxCover>
                      <PlaceholderCover
                        seed={project.slug}
                        label={project.title}
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      />
                    </ParallaxCover>
                    {project.featured ? (
                      <span className="glass absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground">
                        <Star className="size-3 fill-amber-300 text-amber-300" />
                        Featured
                      </span>
                    ) : null}
                  </Link>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <Link href={`/projects/${project.slug}`}>
                      <h3 className="font-display text-lg font-semibold text-foreground transition-colors hover:text-primary-bright">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                      {project.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 ? (
                        <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-subtle">
                          +{project.tech.length - 4}
                        </span>
                      ) : null}
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <div className="flex items-center gap-2">
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} on GitHub`}
                            className="glass flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
                          >
                            <SocialIcon platform="github" className="size-4" />
                          </a>
                        ) : null}
                        {project.youtubeUrl ? (
                          <a
                            href={project.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} demo video`}
                            className="glass flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
                          >
                            <Play className="size-4" />
                          </a>
                        ) : null}
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} live site`}
                            className="glass flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
                          >
                            <SocialIcon platform="globe" className="size-4" />
                          </a>
                        ) : null}
                      </div>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group/link flex items-center gap-1.5 text-sm font-medium text-secondary"
                      >
                        Details
                        <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </TiltCard>
              </Scrub>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
