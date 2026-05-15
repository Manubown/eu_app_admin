/**
 * Thin wrapper over the Supabase Management API.
 * Docs: https://supabase.com/docs/reference/api/introduction
 */

const API = "https://api.supabase.com";

function authHeaders() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) throw new Error("SUPABASE_ACCESS_TOKEN is not set");
  return { Authorization: `Bearer ${token}` };
}

export interface SupabaseProject {
  id: string;
  ref: string;
  name: string;
  region: string;
  status: "ACTIVE_HEALTHY" | "INACTIVE" | "INIT_FAILED" | string;
  created_at: string;
}

export async function listProjects(): Promise<SupabaseProject[]> {
  const res = await fetch(`${API}/v1/projects`, {
    headers: authHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Supabase listProjects ${res.status}`);
  return res.json();
}

export async function getProject(ref: string): Promise<SupabaseProject | null> {
  const all = await listProjects();
  return all.find((p) => p.ref === ref) ?? null;
}
