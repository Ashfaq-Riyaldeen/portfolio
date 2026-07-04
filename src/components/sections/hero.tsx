import { getProfile, type SectionConfig } from "@/lib/content";
import { HeroClient } from "./hero-client";

export async function Hero(_props: { config: SectionConfig }) {
  const profile = await getProfile();
  return <HeroClient profile={profile} />;
}
