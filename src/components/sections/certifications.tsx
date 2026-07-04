import { Section, SectionHeading } from "@/components/ui/section";
import { getCertifications, type SectionConfig } from "@/lib/content";
import { CertificationsClient } from "./certifications-client";

export async function Certifications({ config }: { config: SectionConfig }) {
  const certifications = await getCertifications();
  if (certifications.length === 0) return null;

  return (
    <Section id="certifications">
      <SectionHeading eyebrow="certifications" title={config.title} />
      <CertificationsClient certifications={certifications} />
    </Section>
  );
}
