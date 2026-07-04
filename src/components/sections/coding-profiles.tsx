import {
  ArrowUpRight,
  Code,
  Terminal,
  Trophy,
  Users,
  FolderGit2,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { SocialIcon } from "@/components/ui/social-icon";
import { getCodingProfiles, type SectionConfig } from "@/lib/content";

const lucideIcons: Record<string, LucideIcon> = {
  leetcode: Code,
  hackerrank: Terminal,
  codeforces: Trophy,
  codewars: Code,
  codechef: Terminal,
};

interface GithubStats {
  repos: number;
  followers: number;
}

/** Public GitHub API — no key needed; fails silently for placeholder users. */
async function fetchGithubStats(username: string): Promise<GithubStats | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { repos: data.public_repos ?? 0, followers: data.followers ?? 0 };
  } catch {
    return null;
  }
}

function PlatformIcon({ platform }: { platform: string }) {
  const Icon = lucideIcons[platform.toLowerCase()];
  if (Icon) return <Icon className="size-5" />;
  return <SocialIcon platform={platform} className="size-5" />;
}

export async function CodingProfiles({ config }: { config: SectionConfig }) {
  const profiles = await getCodingProfiles();
  if (profiles.length === 0) return null;

  const github = profiles.find((p) => p.platform.toLowerCase() === "github");
  const stats = github ? await fetchGithubStats(github.username) : null;

  return (
    <Section id="coding-profiles">
      <SectionHeading
        eyebrow="coding-profiles"
        title={config.title}
        lead="Where the code actually lives — repositories, contest ratings, and problem-solving streaks."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile, i) => {
          const isGithubCard =
            profile.platform.toLowerCase() === "github" && stats !== null;

          return (
            <Reveal
              key={profile.platform}
              delay={i * 0.07}
              className={isGithubCard ? "sm:col-span-2" : undefined}
            >
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group flex h-full items-center gap-5 rounded-2xl p-6 transition-all hover:bg-white/6 hover:glow-primary"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 text-primary-bright">
                  <PlatformIcon platform={profile.platform} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {profile.platform}
                  </h3>
                  <p className="truncate font-mono text-xs text-muted">
                    @{profile.username}
                  </p>
                </div>

                {isGithubCard && stats ? (
                  <div className="hidden items-center gap-6 pr-2 sm:flex">
                    <div className="text-center">
                      <p className="flex items-center gap-1.5 font-display text-xl font-bold text-foreground">
                        <FolderGit2 className="size-4 text-secondary" />
                        {stats.repos}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                        Repos
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="flex items-center gap-1.5 font-display text-xl font-bold text-foreground">
                        <Users className="size-4 text-secondary" />
                        {stats.followers}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                        Followers
                      </p>
                    </div>
                  </div>
                ) : null}

                <ArrowUpRight className="size-5 shrink-0 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary" />
              </a>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
