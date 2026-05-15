/**
 * Single source of truth for every product in the EU_Base-App portfolio.
 *
 * The dashboard reads this list to render cards, fan out health checks,
 * and build redirect links to Vercel/Supabase/GitHub dashboards.
 *
 * To add a project: append a new entry. To stop tracking one: remove it.
 */

export type DbProvider = "supabase" | "postgres" | "none";
export type Framework = "nextjs" | "sveltekit" | "other";
export type ProjectStatus = "live" | "in-development" | "planning";

export interface ProjectDefinition {
  slug: string;
  name: string;
  tagline: string;
  status: ProjectStatus;
  framework: Framework;
  db: DbProvider;
  /** Public live URL (used by the health pinger). */
  liveUrl?: string;
  /** GitHub repo for quick-jump. */
  repoUrl?: string;
  /** Vercel project name — used for the Vercel API + dashboard deep-link. */
  vercelProjectName?: string;
  /** Supabase project ref (the 20-char id from the project URL). */
  supabaseProjectRef?: string;
  /** Local workspace folder, relative to the EU_Base-App root. */
  folder: string;
}

export const PROJECTS: ProjectDefinition[] = [
  {
    slug: "graetzl",
    name: "Grätzl",
    tagline: "Anti-TripAdvisor, locally-curated city map. Launching in Vienna.",
    status: "live",
    framework: "nextjs",
    db: "supabase",
    folder: "Graetzl",
    // TODO: fill in after first deploy
    liveUrl: undefined,
    repoUrl: undefined,
    vercelProjectName: "graetzl",
    supabaseProjectRef: undefined,
  },
  {
    slug: "stromoclock",
    name: "Stromoclock",
    tagline: "Electricity-rate awareness clock for European households.",
    status: "in-development",
    framework: "nextjs",
    db: "postgres",
    folder: "stromoclock",
    vercelProjectName: "stromoclock",
  },
  {
    slug: "bubbleboard",
    name: "Bubbleboard",
    tagline: "SvelteKit board app.",
    status: "in-development",
    framework: "sveltekit",
    db: "none",
    folder: "bubbleboard",
    vercelProjectName: "bubbleboard",
  },
  {
    slug: "kleinrechnung",
    name: "Kleinrechnung",
    tagline: "SvelteKit small-invoice tool.",
    status: "in-development",
    framework: "sveltekit",
    db: "none",
    folder: "kleinrechnung",
    vercelProjectName: "kleinrechnung",
  },
  {
    slug: "pantry-polyglot",
    name: "Pantry Polyglot",
    tagline: "Pantry / ingredient translation helper.",
    status: "planning",
    framework: "other",
    db: "none",
    folder: "pantry-polyglot",
  },
  {
    slug: "rail-refund-eu",
    name: "Rail Refund EU",
    tagline: "EU rail-delay refund automation.",
    status: "planning",
    framework: "other",
    db: "none",
    folder: "rail-refund-eu",
  },
  {
    slug: "vienexit",
    name: "Vienexit",
    tagline: "Leaving-Vienna toolkit.",
    status: "planning",
    framework: "other",
    db: "none",
    folder: "vienexit",
  },
];

export function getProject(slug: string): ProjectDefinition | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Deep-links to external dashboards. Pure URL construction, no API calls. */
export function externalLinks(p: ProjectDefinition) {
  return {
    vercel: p.vercelProjectName
      ? `https://vercel.com/dashboard?search=${encodeURIComponent(p.vercelProjectName)}`
      : undefined,
    supabase:
      p.db === "supabase"
        ? p.supabaseProjectRef
          ? `https://supabase.com/dashboard/project/${p.supabaseProjectRef}`
          : "https://supabase.com/dashboard/projects"
        : undefined,
    neon: p.db === "postgres" ? "https://console.neon.tech/app/projects" : undefined,
    repo: p.repoUrl,
    live: p.liveUrl,
  };
}
