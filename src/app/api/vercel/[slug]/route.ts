import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProject } from "@/lib/projects";
import { latestDeployments, listProjects } from "@/lib/vercel";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await params;
  const proj = getProject(slug);
  if (!proj?.vercelProjectName) {
    return NextResponse.json({ error: "no vercel mapping" }, { status: 404 });
  }

  try {
    const all = await listProjects();
    const match = all.find((p) => p.name === proj.vercelProjectName);
    if (!match) return NextResponse.json({ error: "project not found on vercel" }, { status: 404 });
    const deployments = await latestDeployments(match.id, 5);
    return NextResponse.json({ project: match, deployments });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
