import Link from "next/link";
import { externalLinks, type ProjectDefinition } from "@/lib/projects";
import { StatusDot } from "./StatusDot";

const statusBadge: Record<ProjectDefinition["status"], string> = {
  live: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  "in-development": "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  planning: "bg-neutral-700/40 text-neutral-300 ring-neutral-600/40",
};

export function ProjectCard({ project }: { project: ProjectDefinition }) {
  const links = externalLinks(project);
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-neutral-700 transition">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={`/projects/${project.slug}`}
              className="text-lg font-semibold hover:text-white"
            >
              {project.name}
            </Link>
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-neutral-400 hover:text-white"
                title={links.live}
              >
                ↗
              </a>
            )}
          </div>
          <p className="mt-1 text-sm text-neutral-400">{project.tagline}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ${statusBadge[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
        <span>{project.framework}</span>
        <span>·</span>
        <span>{project.db}</span>
        <span>·</span>
        {project.status === "live" ? (
          <StatusDot slug={project.slug} />
        ) : (
          <span className="text-neutral-600">not deployed</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {links.live && (
          <LinkButton href={links.live} label="Live site" />
        )}
        {links.vercel && (
          <LinkButton href={links.vercel} label="Vercel" />
        )}
        {links.supabase && (
          <LinkButton href={links.supabase} label="Supabase" />
        )}
        {links.neon && (
          <LinkButton href={links.neon} label="Neon" />
        )}
        {links.repo && (
          <LinkButton href={links.repo} label="Repo" />
        )}
      </div>
    </div>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="rounded-md border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300 hover:border-neutral-500 hover:text-white"
    >
      {label} ↗
    </a>
  );
}
