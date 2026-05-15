import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { externalLinks, getProject } from "@/lib/projects";
import {
  latestDeployments,
  listProjects as listVercelProjects,
  type VercelDeployment,
} from "@/lib/vercel";
import {
  getProject as getSupabaseProject,
  type SupabaseProject,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface DeploymentsData {
  deployments: VercelDeployment[];
  error?: string;
}

async function loadVercel(projectName?: string): Promise<DeploymentsData> {
  if (!projectName || !process.env.VERCEL_TOKEN) {
    return { deployments: [], error: !projectName ? "not mapped" : "VERCEL_TOKEN missing" };
  }
  try {
    const all = await listVercelProjects();
    const match = all.find((p) => p.name === projectName);
    if (!match) return { deployments: [], error: "not found on Vercel" };
    const deployments = await latestDeployments(match.id, 5);
    return { deployments };
  } catch (err) {
    return {
      deployments: [],
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}

async function loadSupabase(ref?: string): Promise<{ project?: SupabaseProject; error?: string }> {
  if (!ref || !process.env.SUPABASE_ACCESS_TOKEN) {
    return { error: !ref ? "not mapped" : "SUPABASE_ACCESS_TOKEN missing" };
  }
  try {
    const project = await getSupabaseProject(ref);
    return project ? { project } : { error: "not found" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown error" };
  }
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await auth();
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const links = externalLinks(project);
  const [vercel, supabase] = await Promise.all([
    loadVercel(project.vercelProjectName),
    loadSupabase(project.supabaseProjectRef),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/" className="text-sm text-neutral-400 hover:text-white">
        ← Back to dashboard
      </Link>

      <header className="mt-4">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="mt-1 text-neutral-400">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {links.live && <LinkPill href={links.live} label="Live site" />}
          {links.vercel && <LinkPill href={links.vercel} label="Vercel dashboard" />}
          {links.supabase && <LinkPill href={links.supabase} label="Supabase dashboard" />}
          {links.repo && <LinkPill href={links.repo} label="GitHub repo" />}
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Vercel — recent deployments
        </h2>
        <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          {vercel.error ? (
            <p className="text-sm text-neutral-500">{vercel.error}</p>
          ) : vercel.deployments.length === 0 ? (
            <p className="text-sm text-neutral-500">No deployments yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {vercel.deployments.map((d) => (
                <li
                  key={d.uid}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <DeploymentBadge state={d.state} />
                      <a
                        href={`https://${d.url}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="truncate text-neutral-200 hover:text-white"
                      >
                        {d.url}
                      </a>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      {d.target ?? "preview"} · {new Date(d.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Supabase
        </h2>
        <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          {supabase.error ? (
            <p className="text-sm text-neutral-500">{supabase.error}</p>
          ) : supabase.project ? (
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-neutral-500">Name</dt>
              <dd>{supabase.project.name}</dd>
              <dt className="text-neutral-500">Region</dt>
              <dd>{supabase.project.region}</dd>
              <dt className="text-neutral-500">Status</dt>
              <dd>{supabase.project.status}</dd>
              <dt className="text-neutral-500">Created</dt>
              <dd>{new Date(supabase.project.created_at).toLocaleDateString()}</dd>
            </dl>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="rounded-md border border-neutral-700 px-2.5 py-1 text-neutral-300 hover:border-neutral-500 hover:text-white"
    >
      {label} ↗
    </a>
  );
}

const stateColor: Record<VercelDeployment["state"], string> = {
  READY: "bg-emerald-500",
  ERROR: "bg-red-500",
  BUILDING: "bg-amber-500",
  QUEUED: "bg-amber-500",
  INITIALIZING: "bg-amber-500",
  CANCELED: "bg-neutral-500",
};

function DeploymentBadge({ state }: { state: VercelDeployment["state"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
      <span className={`size-2 rounded-full ${stateColor[state] ?? "bg-neutral-600"}`} />
      {state}
    </span>
  );
}
