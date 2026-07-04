import { Section, SectionHeading } from "@/components/ui/section";
import { getFaqs, type SectionConfig } from "@/lib/content";
import { FaqClient } from "./faq-client";

export async function Faq({ config }: { config: SectionConfig }) {
  const faqs = await getFaqs();
  if (faqs.length === 0) return null;

  return (
    <Section id="faq">
      <SectionHeading eyebrow="faq" title={config.title} align="center" />
      <FaqClient items={faqs} />
    </Section>
  );
}
