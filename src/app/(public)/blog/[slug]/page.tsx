import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  // External posts live on Medium/Dev.to — no local page for them
  return posts.filter((p) => !p.externalUrl).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      ...(post.coverUrl ? { images: [{ url: post.coverUrl }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post || post.externalUrl || !post.content) notFound();

  const date = new Date(post.publishedAt).toLocaleDateString("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
      <Link
        href="/#blogs"
        className="group inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        all-posts
      </Link>

      <header className="mt-8">
        <p className="font-mono text-sm text-secondary">{date}</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {post.coverUrl ? (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-line">
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 768px) 720px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <article
        className="mt-10 space-y-5 text-base leading-relaxed text-muted [&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-white/8 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
