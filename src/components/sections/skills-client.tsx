"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import type { SkillCategory } from "@/lib/content";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function SkillsClient({ categories }: { categories: SkillCategory[] }) {
  const allSkills = categories.flatMap((c) => c.skills.map((s) => s.name));

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <Reveal key={category.name} delay={i * 0.07}>
            <div className="glass h-full rounded-2xl p-6 transition-colors hover:bg-white/6">
              <p className="font-mono text-sm text-secondary">
                {"// "}
                {slugify(category.name)}
              </p>
              <ul className="mt-5 space-y-4">
                {category.skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm font-medium text-foreground">
                        {skill.name}
                      </span>
                      {skill.level !== null ? (
                        <span className="font-mono text-[11px] text-subtle">
                          {skill.level}%
                        </span>
                      ) : null}
                    </div>
                    {skill.level !== null ? (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/6">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{
                            duration: 1.1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Infinite marquee of every skill */}
      <Reveal delay={0.15}>
        <div className="group relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-3">
            {[...allSkills, ...allSkills].map((name, i) => (
              <span
                key={`${name}-${i}`}
                aria-hidden={i >= allSkills.length}
                className="glass rounded-full px-5 py-2 font-mono text-xs text-muted"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </>
  );
}
