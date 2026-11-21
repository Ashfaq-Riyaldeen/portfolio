import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Defence in depth: src/proxy.ts already redirects signed-out visitors,
  // but never render admin UI without a verified user.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { error: contentSchemaError } = await supabase
    .from("projects")
    .select("categories")
    .limit(0);
  const previewingSnapshot = process.env.PORTFOLIO_CONTENT_SOURCE === "local";
  const migrationPending = contentSchemaError?.code === "42703";

  return (
    <AdminShell email={user.email ?? ""} signOutAction={signOut}>
      {(migrationPending || previewingSnapshot) && (
        <div role="status" className="mb-8 rounded-xl border border-amber-300/30 bg-amber-300/5 p-5 text-sm leading-relaxed text-muted">
          <p className="font-medium text-foreground">The public site is showing the November 2026 content snapshot.</p>
          <p className="mt-2">
            {migrationPending
              ? "Apply the prepared content migration in Supabase before editing the refreshed content. The site will then use database content again."
              : "This local preview does not display database edits. Use the normal development server to review changes saved here."}
          </p>
          {migrationPending && <p className="mt-2 break-all font-mono text-xs">supabase/migrations/20261121_refresh_portfolio.sql</p>}
        </div>
      )}
      {children}
    </AdminShell>
  );
}
