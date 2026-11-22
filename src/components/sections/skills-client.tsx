import {
  Braces, BrainCircuit, Cloud, Code2, Database, Layers3,
  LayoutTemplate, Network, Server, ShieldCheck, Smartphone, TestTube2,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { SkillCategory } from "@/lib/content";

const categoryIcons: Record<string, LucideIcon> = {
  Languages: Braces,
  Frontend: LayoutTemplate,
  "Backend & APIs": Server,
  "Architecture & Messaging": Network,
  Databases: Database,
  "AI & Machine Learning": BrainCircuit,
  "Data & Analytics": Layers3,
  "Cloud & Delivery": Cloud,
  "Testing & Engineering": TestTube2,
  "Security & Systems": ShieldCheck,
  Mobile: Smartphone,
};

// Cards render on the server; only the entrance reveal is interactive.
export function SkillsClient({ categories }: { categories: SkillCategory[] }) {
  return (
    <div data-skills-grid className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category, index) => {
        const Icon = categoryIcons[category.name] ?? Code2;
        return (
          <Reveal key={category.name} delay={(index % 3) * 0.06} y={0} className="h-full">
            <article data-skill-category className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.015] p-5 transition-colors duration-300 hover:border-primary/40 hover:bg-primary/5 sm:p-6">
              <div aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
              <div className="flex min-h-14 items-center gap-3 border-b border-white/8 pb-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-secondary">
                  <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                </span>
                <h3 className="font-display text-base font-semibold leading-snug text-foreground sm:text-lg">{category.name}</h3>
              </div>
              <ul aria-label={`${category.name} skills`} className="mt-5 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="max-w-full rounded-lg border border-white/8 bg-background/35 px-3 py-2 text-sm leading-snug text-muted [overflow-wrap:anywhere] transition-colors group-hover:border-white/12 group-hover:text-foreground">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
