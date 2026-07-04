"use client";

import { ArrowUpRight, Award, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Lightbox } from "@/components/ui/lightbox";
import { PlaceholderCover } from "@/components/ui/placeholder-cover";
import type { Certification } from "@/lib/content";
import { formatMonth } from "@/lib/utils";

const isImage = (url: string) => /\.(png|jpe?g|webp|gif|avif)$/i.test(url);

export function CertificationsClient({
  certifications,
}: {
  certifications: Certification[];
}) {
  const [viewer, setViewer] = useState<{ src: string; alt: string } | null>(
    null,
  );

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => {
          const viewableImage =
            cert.fileUrl && isImage(cert.fileUrl) ? cert.fileUrl : null;

          return (
            <Reveal key={cert.title} delay={i * 0.06}>
              <article className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition-shadow hover:glow-secondary">
                {/* Certificate preview */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {viewableImage ? (
                    <button
                      type="button"
                      onClick={() =>
                        setViewer({ src: viewableImage, alt: cert.title })
                      }
                      className="absolute inset-0"
                      aria-label={`View certificate: ${cert.title}`}
                    >
                      <Image
                        src={viewableImage}
                        alt={cert.title}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground">
                          <Eye className="size-4" /> View
                        </span>
                      </span>
                    </button>
                  ) : (
                    <PlaceholderCover
                      seed={cert.title}
                      icon={<Award className="size-12 text-white/30" />}
                      className="absolute inset-0"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-[11px] text-secondary">
                    {formatMonth(cert.issueDate)}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-foreground">
                    {cert.title}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-muted">
                    {cert.issuer}
                  </p>

                  {cert.skills.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-secondary transition-opacity hover:opacity-80"
                      >
                        Verify
                        <ArrowUpRight className="size-4" />
                      </a>
                    ) : (
                      <span />
                    )}
                    {cert.credentialId ? (
                      <span
                        className="max-w-[10rem] truncate font-mono text-[10px] text-subtle"
                        title={cert.credentialId}
                      >
                        ID: {cert.credentialId}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Lightbox
        open={viewer !== null}
        src={viewer?.src ?? null}
        alt={viewer?.alt ?? "Certificate"}
        onClose={() => setViewer(null)}
      />
    </>
  );
}
