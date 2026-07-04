import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

type Db = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function tableCount(
  db: Db,
  table: string,
  filter?: { column: string; value: boolean },
): Promise<number> {
  let query = db.from(table).select("*", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count, error } = await query;
  if (error) return 0;
  return count ?? 0;
}

export default async function AdminDashboard() {
  const db = await createSupabaseServerClient();

  const [
    projects,
    posts,
    certifications,
    achievements,
    education,
    experience,
    publications,
    testimonials,
    unread,
  ] = await Promise.all([
    tableCount(db, "projects"),
    tableCount(db, "blog_posts"),
    tableCount(db, "certifications"),
    tableCount(db, "achievements"),
    tableCount(db, "education"),
    tableCount(db, "experience"),
    tableCount(db, "publications"),
    tableCount(db, "testimonials"),
    tableCount(db, "messages", { column: "read", value: false }),
  ]);

  const cards = [
    { label: "Projects", value: projects },
    { label: "Blog posts", value: posts },
    { label: "Certifications", value: certifications },
    { label: "Achievements", value: achievements },
    { label: "Education", value: education },
    { label: "Experience", value: experience },
    { label: "Publications", value: publications },
    { label: "Testimonials", value: testimonials },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-mono text-sm text-secondary">{"// dashboard"}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Welcome back<span className="text-gradient">.</span>
      </h1>
      <p className="mt-2 text-sm text-muted">
        Everything you publish here appears on the live site straight away.
      </p>

      {/* Unread messages call-out */}
      <Link
        href="/admin/messages"
        className={
          unread > 0
            ? "mt-8 block rounded-2xl border border-primary/40 bg-primary/10 p-5 transition-colors hover:bg-primary/15"
            : "glass mt-8 block rounded-2xl p-5 transition-colors hover:bg-white/8"
        }
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
          Inbox
        </p>
        <p className="mt-1 text-sm text-muted">
          {unread > 0 ? (
            <>
              <span className="font-semibold text-foreground">{unread}</span>{" "}
              unread message{unread === 1 ? "" : "s"} waiting — open the inbox.
            </>
          ) : (
            "No unread messages."
          )}
        </p>
      </Link>

      {/* Content counts */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="glass rounded-2xl p-5">
            <p className="font-display text-3xl font-bold text-foreground">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="mt-10 font-mono text-sm text-secondary">
        {"// quick actions"}
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/admin/c/projects/new"
          className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-shadow hover:shadow-primary/45"
        >
          Add a project
        </Link>
        <Link
          href="/admin/profile"
          className="glass rounded-xl px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/8"
        >
          Edit profile
        </Link>
        <Link
          href="/admin/sections"
          className="glass rounded-xl px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/8"
        >
          Manage sections
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="glass rounded-xl px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/8"
        >
          View live site
        </a>
      </div>
    </div>
  );
}
