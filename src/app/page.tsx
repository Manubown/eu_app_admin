import { auth, signOut } from "@/auth";
import { PROJECTS } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";

export default async function Dashboard() {
  const session = await auth();
  const live = PROJECTS.filter((p) => p.status === "live").length;
  const dev = PROJECTS.filter((p) => p.status === "in-development").length;
  const planning = PROJECTS.filter((p) => p.status === "planning").length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">EU_Base-App Admin</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {PROJECTS.length} projects · {live} live · {dev} in dev · {planning} planning
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span>{session?.user?.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/signin" });
            }}
          >
            <button className="rounded border border-neutral-700 px-2 py-1 hover:border-neutral-500">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </section>
    </main>
  );
}
