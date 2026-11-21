import { getProfile, getVisibleSections } from "@/lib/content";
import { HeroClient } from "./hero-client";

export async function Hero() {
  const [profile, sections] = await Promise.all([getProfile(), getVisibleSections()]);
  const nextSection = sections[sections.findIndex((section) => section.key === "hero") + 1];
  return <HeroClient
    profile={profile}
    projectsHref={sections.some((section) => section.key === "projects") ? "#projects" : "/projects"}
    nextSection={nextSection ? { id: nextSection.key, label: nextSection.navLabel } : null}
  />;
}
