"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ParallaxCover } from "@/components/motion/parallax-cover";
import { TiltCard } from "@/components/motion/tilt-card";
import { ScrollTrigger } from "@/lib/gsap";
import { PlaceholderCover } from "@/components/ui/placeholder-cover";
import { SocialIcon } from "@/components/ui/social-icon";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

const MAX_FILTERS = 5;

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects)
      for (const t of p.tech) counts.set(t, (counts.get(t) ?? 0) + 1);
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_FILTERS)
      .map(([tech]) => tech);
    return ["All", ...top];
  }, [projects]);

  const [active, setActive] = useState("All");
  const shown =
    active === "All"
      ? projects
      : projects.filter((p) => p.tech.includes(active));

  // Cards re-flow when the filter changes (popLayout); recompute parallax
  // trigger positions once the exit/enter animations have settled.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 450);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <>
      {/* Tech filters */}
      <div className="mb-10 flex flex-wrap gap-2.5">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((project) => (
            <motion.article
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard>
                <div className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition-shadow hover:glow-primary">
                  {/* Cover */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="relative block aspect-video overflow-hidden"
                  >
                    <ParallaxCover>
                      {project.coverUrl ? (
                        <Image
                          src={project.coverUrl}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <PlaceholderCover
                          seed={project.slug}
                          label={project.title}
                          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
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
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
