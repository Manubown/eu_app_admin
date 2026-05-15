import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProject } from "@/lib/projects";
import { getProject as getSupabaseProject } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await params;
  const proj = getProject(slug);
  if (!proj?.supabaseProjectRef) {
    return NextResponse.json({ error: "no supabase mapping" }, { status: 404 });
  }

  try {
    const sb = await getSupabaseProject(proj.supabaseProjectRef);
    if (!sb) return NextResponse.json({ error: "project not found" }, { status: 404 });
    return NextResponse.json(sb);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
