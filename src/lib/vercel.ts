/**
 * Thin wrapper over the Vercel REST API.
 * Docs: https://vercel.com/docs/rest-api
 */

const API = "https://api.vercel.com";

function authHeaders() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN is not set");
  return { Authorization: `Bearer ${token}` };
}

function teamQuery() {
  const id = process.env.VERCEL_TEAM_ID;
  return id ? `teamId=${encodeURIComponent(id)}` : "";
}

export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: "READY" | "ERROR" | "BUILDING" | "QUEUED" | "INITIALIZING" | "CANCELED";
  readyState: string;
  createdAt: number;
  target?: "production" | "preview" | null;
  meta?: Record<string, string>;
}

export interface VercelProjectSummary {
  id: string;
  name: string;
  framework: string | null;
  latestDeployment?: VercelDeployment;
}

export async function listProjects(): Promise<VercelProjectSummary[]> {
  const qs = teamQuery();
  const res = await fetch(`${API}/v9/projects${qs ? `?${qs}` : ""}`, {
    headers: authHeaders(),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Vercel listProjects ${res.status}`);
  const data = await res.json();
  return (data.projects ?? []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    name: p.name as string,
    framework: (p.framework as string | null) ?? null,
    latestDeployment: (p as { latestDeployments?: VercelDeployment[] })
      .latestDeployments?.[0],
  }));
}

export async function latestDeployments(
  projectIdOrName: string,
  limit = 5,
): Promise<VercelDeployment[]> {
  const params = new URLSearchParams({
    projectId: projectIdOrName,
    limit: String(limit),
  });
  const tq = teamQuery();
  if (tq) params.set("teamId", tq.split("=")[1]);
  const res = await fetch(`${API}/v6/deployments?${params}`, {
    headers: authHeaders(),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Vercel deployments ${res.status}`);
  const data = await res.json();
  return data.deployments ?? [];
}
