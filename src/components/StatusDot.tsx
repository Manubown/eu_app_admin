"use client";

import { useEffect, useState } from "react";
import type { HealthResult } from "@/lib/health";

const colorMap: Record<HealthResult["state"], string> = {
  up: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
  unknown: "bg-neutral-600",
};

export function StatusDot({ slug }: { slug: string }) {
  const [result, setResult] = useState<HealthResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/health/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) setResult({ state: "unknown", checkedAt: new Date().toISOString() });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const state = result?.state ?? "unknown";
  const label =
    result?.state === "up"
      ? `Up (${result.status} · ${result.latencyMs}ms)`
      : result?.state === "degraded"
      ? `Degraded (${result.status})`
      : result?.state === "down"
      ? "Down"
      : "Checking…";

  return (
    <span className="inline-flex items-center gap-2 text-xs text-neutral-400">
      <span className={`size-2 rounded-full ${colorMap[state]}`} aria-hidden />
      {label}
    </span>
  );
}
