import { sectionRegistry } from "@/components/sections/registry";
import { getVisibleSections } from "@/lib/content";

export default async function Home() {
  const sections = await getVisibleSections();

  return (
    <>
      {sections.map((section) => {
        const SectionComponent = sectionRegistry[section.key];
        if (!SectionComponent) return null;
        return <SectionComponent key={section.key} config={section} />;
      })}
    </>
  );
}
