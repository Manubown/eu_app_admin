/**
 * Ping a public URL and classify the response.
 * Used for the "is the site up" dot on each project card.
 */

export type HealthState = "up" | "degraded" | "down" | "unknown";

export interface HealthResult {
  state: HealthState;
  status?: number;
  latencyMs?: number;
  error?: string;
  checkedAt: string;
}

export async function pingUrl(url: string, timeoutMs = 5000): Promise<HealthResult> {
  const checkedAt = new Date().toISOString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "user-agent": "eu-base-app-admin/1.0" },
      cache: "no-store",
    });
    const latencyMs = Math.round(performance.now() - start);
    let state: HealthState = "up";
    if (res.status >= 500) state = "down";
    else if (res.status >= 400) state = "degraded";
    return { state, status: res.status, latencyMs, checkedAt };
  } catch (err) {
    return {
      state: "down",
      error: err instanceof Error ? err.message : "unknown error",
      checkedAt,
    };
  } finally {
    clearTimeout(timer);
  }
}
