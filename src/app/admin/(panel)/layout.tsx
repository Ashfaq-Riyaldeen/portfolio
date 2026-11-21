import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { readContentState } from "@/lib/content";

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

  const contentState = await readContentState(true);
  const previewingSnapshot = contentState.source === "local";
  const usingFallback = contentState.source === "fallback";

  return (
    <AdminShell email={user.email ?? ""} signOutAction={signOut}>
      {(usingFallback || previewingSnapshot) && (
        <div role="status" className="mb-8 rounded-xl border border-amber-300/30 bg-amber-300/5 p-5 text-sm leading-relaxed text-muted">
          <p className="font-medium text-foreground">The public site is showing the November 2026 content snapshot.</p>
          <p className="mt-2">
            {usingFallback
              ? "The public content could not be loaded from Supabase. Check the connection and apply any pending migration. Changes saved here will not appear publicly until database reads are working."
              : "This local preview does not display database edits. Use the normal development server to review changes saved here."}
          </p>
          {usingFallback && <p className="mt-2 break-all font-mono text-xs">{contentState.error}</p>}
        </div>
      )}
      {contentState.source === "supabase" && <p role="status" className="mb-6 text-sm text-emerald-400">Connected to live content. Saved changes appear on the next public page load.</p>}
      {children}
    </AdminShell>
  );
}
