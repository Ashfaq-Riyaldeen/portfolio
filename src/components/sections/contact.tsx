import { Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { SocialIcon } from "@/components/ui/social-icon";
import { getProfile, type SectionConfig } from "@/lib/content";
import { ContactForm } from "./contact-client";

export async function Contact({ config }: { config: SectionConfig }) {
  const profile = await getProfile();

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="contact"
        title={config.title}
        lead="Have a project, an internship, or just an idea worth chasing? My inbox is open — I usually reply within a day."
      />

      <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
        {/* Direct channels */}
        <div className="space-y-4">
          <Reveal delay={0.1}>
            <a
              href={`mailto:${profile.email}`}
              className="glass group flex items-center gap-5 rounded-2xl p-6 transition-all hover:bg-white/6 hover:glow-primary"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 text-primary-bright">
                <Mail className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-widest text-subtle">
                  Email
                </span>
                <span className="block truncate font-medium text-foreground group-hover:text-primary-bright">
                  {profile.email}
                </span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="glass flex items-center gap-5 rounded-2xl p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 text-primary-bright">
                <MapPin className="size-5" />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-widest text-subtle">
                  Location
                </span>
                <span className="block font-medium text-foreground">
                  {profile.location}
                </span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="glass rounded-2xl p-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                Elsewhere
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {profile.socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="glass flex size-11 items-center justify-center rounded-full text-muted transition-all hover:-translate-y-0.5 hover:text-foreground hover:glow-primary"
                  >
                    <SocialIcon platform={social.platform} className="size-4.5" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.15}>
          <ContactForm toEmail={profile.email} />
        </Reveal>
      </div>
    </Section>
  );
}
