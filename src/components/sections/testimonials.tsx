import { Section, SectionHeading } from "@/components/ui/section";
import { getTestimonials, type SectionConfig } from "@/lib/content";
import { TestimonialsClient } from "./testimonials-client";

export async function Testimonials({ config }: { config: SectionConfig }) {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="testimonials"
        title={config.title}
        align="center"
      />
      <TestimonialsClient items={testimonials} />
    </Section>
  );
}
