import { Section, SectionHeading } from "@/components/ui/section";
import { getGallery, type SectionConfig } from "@/lib/content";
import { GalleryClient } from "./gallery-client";

export async function Gallery({ config }: { config: SectionConfig }) {
  const items = await getGallery();
  if (items.length === 0) return null;

  return (
    <Section id="gallery">
      <SectionHeading eyebrow="gallery" title={config.title} />
      <GalleryClient items={items} />
    </Section>
  );
}
