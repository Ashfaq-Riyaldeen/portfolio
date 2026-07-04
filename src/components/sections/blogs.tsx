import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderCover } from "@/components/ui/placeholder-cover";
import { Section, SectionHeading } from "@/components/ui/section";
import { getBlogPosts, type BlogPost, type SectionConfig } from "@/lib/content";

function PostCard({ post }: { post: BlogPost }) {
  const external = Boolean(post.externalUrl);
  const href = post.externalUrl ?? `/blog/${post.slug}`;
  const date = new Date(post.publishedAt).toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const inner = (
    <article className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition-shadow hover:glow-primary">
      <div className="relative aspect-[16/9] overflow-hidden">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderCover
            seed={post.slug}
            label={post.title}
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] text-secondary">{date}</p>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 overflow-hidden text-sm leading-relaxed text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="mt-5 flex items-center gap-1.5 border-t border-line pt-4 text-sm font-medium text-secondary">
          Read {external ? "on external site" : "article"}
          {external ? (
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          ) : (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          )}
        </span>
      </div>
    </article>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}

export async function Blogs({ config }: { config: SectionConfig }) {
  const posts = await getBlogPosts();
  if (posts.length === 0) return null;

  return (
    <Section id="blogs">
      <SectionHeading eyebrow="technical-blogs" title={config.title} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.07} className="h-full">
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
