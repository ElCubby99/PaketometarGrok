import { heatPoints } from "./fixtures";
import type {
  DurationTail,
  HeatPoint,
  MapBlob,
  MapFilters,
  MetricReadout,
  TimeWindow,
} from "./types";

export const defaultFilters: MapFilters = {
  problem: "all",
  tail: "p90",
  resolution: "all",
  carrier: "all",
  area: "zagreb",
  time: "30d",
};

export function withinTime(daysAgo: number, time: TimeWindow): boolean {
  if (time === "7d") return daysAgo <= 7;
  if (time === "30d") return daysAgo <= 30;
  if (time === "90d") return daysAgo <= 90;
  return daysAgo <= 400;
}

export function filterHeatPoints(points: HeatPoint[], filters: MapFilters): HeatPoint[] {
  return points.filter((point) => {
    if (!withinTime(point.daysAgo, filters.time)) return false;
    if (filters.area !== "hr" && point.city !== filters.area) return false;
    if (filters.carrier !== "all" && point.carrierSlug !== filters.carrier) return false;
    if (filters.problem !== "all" && point.problem !== filters.problem) return false;
    if (filters.resolution !== "all" && point.resolution !== filters.resolution) return false;
    return true;
  });
}

function sum(points: HeatPoint[]): number {
  return points.reduce((total, point) => total + point.weight, 0);
}

export function weightedPercentile(points: HeatPoint[], percentile: number): number {
  if (points.length === 0) return 0;
  const sorted = [...points].sort((a, b) => a.durationDays - b.durationDays);
  const total = sum(sorted);
  if (total <= 0) return 0;
  const target = (percentile / 100) * total;
  let cumulative = 0;
  for (const point of sorted) {
    cumulative += point.weight;
    if (cumulative >= target) return point.durationDays;
  }
  return sorted[sorted.length - 1].durationDays;
}

export function delayShare(points: HeatPoint[]): number {
  const total = sum(points);
  if (total <= 0) return 0;
  const delay = sum(points.filter((point) => point.problem === "delay"));
  return Math.round((delay / total) * 100);
}

export function computeMetrics(points: HeatPoint[], tail: DurationTail): MetricReadout {
  const sampleSize = sum(points);
  if (sampleSize <= 0) {
    return {
      sampleSize: 0,
      moderated: 0,
      pending: 0,
      problemShare: 0,
      durationDays: 0,
      durationPercent: 0,
      resolutionShare: 0,
      empty: true,
    };
  }
  const problems = points.filter((point) => point.problem !== "ok");
  const problemWeight = sum(problems);
  const percentile = tail === "p50" ? 50 : tail === "p90" ? 90 : 99;
  const durationDays = weightedPercentile(points, percentile);
  const realWeight = sum(problems.filter((point) => point.resolution === "real"));
  return {
    sampleSize,
    moderated: sum(points.filter((point) => point.moderation === "moderated")),
    pending: sum(points.filter((point) => point.moderation === "pending")),
    problemShare: Math.round((problemWeight / sampleSize) * 100),
    durationDays,
    durationPercent: Math.max(0, Math.min(100, (durationDays / 10) * 100)),
    resolutionShare: problemWeight === 0 ? 0 : Math.round((realWeight / problemWeight) * 100),
    empty: false,
  };
}

/** Kernel intensity for the calibrated pressure scale. Share of non-ok weight in the cell. */
export function intensityFromShare(share: number): number {
  const clamped = Math.max(0, Math.min(1, share));
  if (clamped >= 0.5) return Math.min(1, 0.7 + (clamped - 0.5) * 0.9);
  if (clamped >= 0.28) return 0.42 + (clamped - 0.28) * 1.25;
  return 0.18 + clamped * 0.7;
}

export function blobsFromPoints(points: HeatPoint[], labelAllowlist?: string[]): MapBlob[] {
  const groups = new Map<string, HeatPoint[]>();
  for (const point of points) {
    const key = `${point.city}:${point.areaLabel}`;
    const list = groups.get(key);
    if (list) list.push(point);
    else groups.set(key, [point]);
  }

  const blobs: MapBlob[] = [];
  for (const group of groups.values()) {
    const total = sum(group);
    if (total <= 0) continue;
    const problemWeight = sum(group.filter((point) => point.problem !== "ok"));
    const head = group[0];
    const allowed = !labelAllowlist || labelAllowlist.includes(head.areaLabel);
    blobs.push({
      lat: head.lat,
      lng: head.lng,
      intensity: intensityFromShare(problemWeight / total),
      label: allowed ? head.areaLabel : undefined,
    });
  }
  return blobs;
}

export const homePreviewPoints = filterHeatPoints(heatPoints, {
  ...defaultFilters,
  time: "7d",
  area: "zagreb",
});

export const homePreviewReadout = {
  delayShare: delayShare(homePreviewPoints),
  sampleSize: homePreviewPoints.reduce((sum, point) => sum + point.weight, 0),
};
