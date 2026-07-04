import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client for the admin area. Shares the auth cookies
 * set at login, so uploads to Storage run as the signed-in admin.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
