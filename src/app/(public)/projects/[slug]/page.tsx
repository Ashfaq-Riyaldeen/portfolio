import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceholderCover } from "@/components/ui/placeholder-cover";
import { SocialIcon } from "@/components/ui/social-icon";
import { YouTubeEmbed } from "@/components/ui/youtube-embed";
import { getProject, getProjects } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}`,
      ...(project.coverUrl ? { images: [{ url: project.coverUrl }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-32">
      <Link
        href="/#projects"
        className="group inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        all-projects
      </Link>

      {/* Header */}
      <header className="mt-8">
        {project.featured ? (
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
            <Star className="size-3 fill-amber-300 text-amber-300" />
            Featured project
          </p>
        ) : null}
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-gradient">{project.title}</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
          {project.summary}
        </p>
      </header>

      {/* Media: demo video wins over cover image */}
      <div className="mt-10">
        {project.youtubeUrl ? (
          <YouTubeEmbed
            url={project.youtubeUrl}
            title={`${project.title} — demo video`}
          />
        ) : project.coverUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-line">
            <Image
              src={project.coverUrl}
              alt={project.title}
              fill
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <PlaceholderCover
            seed={project.slug}
            label={project.title}
            className="aspect-video rounded-2xl border border-line"
          />
        )}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_280px]">
        {/* Write-up + gallery */}
        <div>
          <h2 className="font-mono text-sm text-secondary">{"// overview"}</h2>
          <div
            className="mt-5 space-y-4 text-base leading-relaxed text-muted"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />

          {project.gallery.length > 0 ? (
            <>
              <h2 className="mt-12 font-mono text-sm text-secondary">
                {"// gallery"}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {project.gallery.map((image, i) => (
                  <div
                    key={image}
                    className="relative aspect-video overflow-hidden rounded-xl border border-line"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} screenshot ${i + 1}`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* Sticky meta panel */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass rounded-2xl p-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
              Tech stack
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-line pt-6">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/8"
                >
                  <span className="flex items-center gap-2.5">
                    <SocialIcon platform="github" className="size-4" />
                    Source Code
                  </span>
                  <ArrowUpRight className="size-4 text-subtle" />
                </a>
              ) : null}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-medium text-white shadow-md shadow-primary/25 transition-shadow hover:shadow-primary/45"
                >
                  Live Demo
                  <ArrowUpRight className="size-4" />
                </a>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
