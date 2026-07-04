import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { getProfile, getSettings } from "@/lib/content";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#05050a",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, profile] = await Promise.all([getSettings(), getProfile()]);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: settings.siteTitle,
      template: `%s · ${profile.name}`,
    },
    description: settings.metaDescription,
    openGraph: {
      type: "website",
      siteName: settings.siteTitle,
      title: settings.siteTitle,
      description: settings.metaDescription,
      url: "/",
      ...(settings.ogImageUrl
        ? { images: [{ url: settings.ogImageUrl, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: settings.ogImageUrl ? "summary_large_image" : "summary",
      title: settings.siteTitle,
      description: settings.metaDescription,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {/* Uploaded images live on Supabase Storage — warm the connection early */}
        {supabaseUrl ? <link rel="preconnect" href={supabaseUrl} /> : null}
        {children}
      </body>
    </html>
  );
}
