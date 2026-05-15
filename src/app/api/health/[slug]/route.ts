import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProject } from "@/lib/projects";
import { pingUrl } from "@/lib/health";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await params;
  const proj = getProject(slug);
  if (!proj?.liveUrl) {
    return NextResponse.json({ state: "unknown", checkedAt: new Date().toISOString() });
  }
  const result = await pingUrl(proj.liveUrl);
  return NextResponse.json(result);
}
