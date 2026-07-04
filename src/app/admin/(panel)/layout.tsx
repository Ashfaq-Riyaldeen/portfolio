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

  return (
    <AdminShell email={user.email ?? ""} signOutAction={signOut}>
      {children}
    </AdminShell>
  );
}
