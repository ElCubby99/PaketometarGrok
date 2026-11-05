import type {
  CarrierSlug,
  CityId,
  HeatPoint,
  ProblemType,
  ResolutionKind,
} from "./types";

/**
 * SYNTHETIC FIXTURES.
 * These weights are authored so the default Zagreb / 30-day reading matches the
 * design mock (n = 4102, problem share 41%, p90 = 6.2 d, real resolution 28%).
 * They are not observations of Hrvatska pošta, GLS, DPD, DHL, Overseas/Tisak, or BoxNow.
 */

interface Neighborhood {
  city: CityId;
  areaLabel: string;
  lat: number;
  lng: number;
  problemShare: number;
  okShare: number;
}

interface ClassSpec {
  daysAgo: number;
  problem: ProblemType;
  resolution: ResolutionKind;
  durationDays: number;
  weight: number;
  bias: "problem" | "ok";
}

const carrierSlugs: CarrierSlug[] = [
  "hrvatska-posta",
  "gls",
  "dpd",
  "dhl",
  "tisak-overseas",
  "boxnow",
];

const zagrebNeighborhoods: Neighborhood[] = [
  { city: "zagreb", areaLabel: "Centar", lat: 45.8131, lng: 15.9775, problemShare: 3.2, okShare: 1 },
  { city: "zagreb", areaLabel: "Trešnjevka", lat: 45.7984, lng: 15.9422, problemShare: 3.4, okShare: 0.9 },
  { city: "zagreb", areaLabel: "Dugave", lat: 45.7632, lng: 16.0118, problemShare: 2.6, okShare: 1 },
  { city: "zagreb", areaLabel: "Trnje", lat: 45.7955, lng: 15.9804, problemShare: 1.6, okShare: 1.3 },
  { city: "zagreb", areaLabel: "Novi Zagreb", lat: 45.7786, lng: 15.9812, problemShare: 1.2, okShare: 1.8 },
  { city: "zagreb", areaLabel: "Maksimir", lat: 45.8318, lng: 16.0194, problemShare: 0.7, okShare: 1.6 },
];

const splitNeighborhoods: Neighborhood[] = [
  { city: "split", areaLabel: "Bačvice", lat: 43.5002, lng: 16.4498, problemShare: 2.1, okShare: 1 },
  { city: "split", areaLabel: "Spinut", lat: 43.5168, lng: 16.4274, problemShare: 1.1, okShare: 1.4 },
];

const rijekaNeighborhoods: Neighborhood[] = [
  { city: "rijeka", areaLabel: "Centar", lat: 45.3271, lng: 14.4422, problemShare: 1.8, okShare: 1.1 },
  { city: "rijeka", areaLabel: "Turnić", lat: 45.3344, lng: 14.4276, problemShare: 1.2, okShare: 1.3 },
];

const osijekNeighborhoods: Neighborhood[] = [
  { city: "osijek", areaLabel: "Centar", lat: 45.555, lng: 18.6955, problemShare: 1.7, okShare: 1 },
  { city: "osijek", areaLabel: "Jug", lat: 45.5442, lng: 18.689, problemShare: 1.3, okShare: 1.2 },
];

/** Default Zagreb window. Sum of weights with daysAgo <= 30 is 4102. */
const zagrebCore: ClassSpec[] = [
  { daysAgo: 4, problem: "ok", resolution: "none", durationDays: 2.4, weight: 414, bias: "ok" },
  { daysAgo: 4, problem: "delay", resolution: "real", durationDays: 6.2, weight: 300, bias: "problem" },
  { daysAgo: 4, problem: "delay", resolution: "generic", durationDays: 6.2, weight: 300, bias: "problem" },
  { daysAgo: 4, problem: "delay", resolution: "rejected", durationDays: 6.2, weight: 174, bias: "problem" },
  { daysAgo: 4, problem: "damage", resolution: "generic", durationDays: 6.2, weight: 40, bias: "problem" },
  { daysAgo: 4, problem: "damage", resolution: "rejected", durationDays: 6.2, weight: 20, bias: "problem" },
  { daysAgo: 16, problem: "ok", resolution: "none", durationDays: 2.4, weight: 2006, bias: "ok" },
  { daysAgo: 16, problem: "delay", resolution: "real", durationDays: 6.2, weight: 171, bias: "problem" },
  { daysAgo: 16, problem: "damage", resolution: "generic", durationDays: 6.2, weight: 267, bias: "problem" },
  { daysAgo: 16, problem: "non-delivery", resolution: "generic", durationDays: 9.1, weight: 123, bias: "problem" },
  { daysAgo: 16, problem: "non-delivery", resolution: "rejected", durationDays: 9.1, weight: 157, bias: "problem" },
  { daysAgo: 16, problem: "communication", resolution: "rejected", durationDays: 9.1, weight: 89, bias: "problem" },
  { daysAgo: 16, problem: "non-delivery", resolution: "rejected", durationDays: 12, weight: 41, bias: "problem" },
];

const zagrebLonger: ClassSpec[] = [
  { daysAgo: 55, problem: "ok", resolution: "none", durationDays: 2.8, weight: 420, bias: "ok" },
  { daysAgo: 55, problem: "delay", resolution: "generic", durationDays: 7.4, weight: 180, bias: "problem" },
  { daysAgo: 140, problem: "ok", resolution: "none", durationDays: 3.1, weight: 260, bias: "ok" },
  { daysAgo: 140, problem: "damage", resolution: "real", durationDays: 6.5, weight: 90, bias: "problem" },
];

const splitCore: ClassSpec[] = [
  { daysAgo: 9, problem: "ok", resolution: "none", durationDays: 2.2, weight: 310, bias: "ok" },
  { daysAgo: 9, problem: "non-delivery", resolution: "rejected", durationDays: 8.2, weight: 140, bias: "problem" },
  { daysAgo: 20, problem: "delay", resolution: "generic", durationDays: 6.6, weight: 96, bias: "problem" },
  { daysAgo: 48, problem: "ok", resolution: "none", durationDays: 2.5, weight: 120, bias: "ok" },
];

const rijekaCore: ClassSpec[] = [
  { daysAgo: 6, problem: "ok", resolution: "none", durationDays: 2.1, weight: 180, bias: "ok" },
  { daysAgo: 14, problem: "damage", resolution: "real", durationDays: 5.5, weight: 70, bias: "problem" },
  { daysAgo: 22, problem: "delay", resolution: "generic", durationDays: 6.8, weight: 84, bias: "problem" },
  { daysAgo: 70, problem: "ok", resolution: "none", durationDays: 2.9, weight: 90, bias: "ok" },
];

const osijekCore: ClassSpec[] = [
  { daysAgo: 11, problem: "ok", resolution: "none", durationDays: 3.2, weight: 210, bias: "ok" },
  { daysAgo: 18, problem: "delay", resolution: "generic", durationDays: 7.8, weight: 130, bias: "problem" },
  { daysAgo: 27, problem: "communication", resolution: "rejected", durationDays: 8.4, weight: 54, bias: "problem" },
  { daysAgo: 110, problem: "ok", resolution: "none", durationDays: 3.4, weight: 80, bias: "ok" },
];

function sharesFor(problem: ProblemType): Record<CarrierSlug, number> {
  if (problem === "delay") {
    return {
      "hrvatska-posta": 0.24,
      gls: 0.3,
      dpd: 0.18,
      dhl: 0.08,
      "tisak-overseas": 0.14,
      boxnow: 0.06,
    };
  }
  if (problem === "non-delivery") {
    return {
      "hrvatska-posta": 0.22,
      gls: 0.16,
      dpd: 0.28,
      dhl: 0.08,
      "tisak-overseas": 0.18,
      boxnow: 0.08,
    };
  }
  if (problem === "ok") {
    return {
      "hrvatska-posta": 0.26,
      gls: 0.18,
      dpd: 0.16,
      dhl: 0.14,
      "tisak-overseas": 0.12,
      boxnow: 0.14,
    };
  }
  return {
    "hrvatska-posta": 0.28,
    gls: 0.22,
    dpd: 0.18,
    dhl: 0.1,
    "tisak-overseas": 0.14,
    boxnow: 0.08,
  };
}

function allocate(total: number, entries: { key: string; share: number }[]): Map<string, number> {
  const rows = entries.map((entry) => {
    const exact = total * entry.share;
    return {
      key: entry.key,
      weight: Math.floor(exact),
      frac: exact - Math.floor(exact),
    };
  });
  let used = rows.reduce((sum, row) => sum + row.weight, 0);
  const order = [...rows].sort((a, b) => b.frac - a.frac || a.key.localeCompare(b.key));
  let index = 0;
  while (used < total && order.length > 0) {
    order[index % order.length].weight += 1;
    used += 1;
    index += 1;
  }
  return new Map(rows.map((row) => [row.key, row.weight]));
}

function emitClasses(specs: ClassSpec[], neighborhoods: Neighborhood[], into: HeatPoint[]) {
  for (const spec of specs) {
    const shareKey = spec.bias === "problem" ? "problemShare" : "okShare";
    const shareSum = neighborhoods.reduce((sum, area) => sum + area[shareKey], 0);
    const byArea = allocate(
      spec.weight,
      neighborhoods.map((area) => ({
        key: area.areaLabel,
        share: area[shareKey] / shareSum,
      })),
    );
    const carrierShares = sharesFor(spec.problem);
    for (const area of neighborhoods) {
      const areaWeight = byArea.get(area.areaLabel) ?? 0;
      if (areaWeight <= 0) continue;
      const byCarrier = allocate(
        areaWeight,
        carrierSlugs.map((slug) => ({ key: slug, share: carrierShares[slug] })),
      );
      for (const slug of carrierSlugs) {
        const weight = byCarrier.get(slug) ?? 0;
        if (weight <= 0) continue;
        into.push({
          id: `${area.city}-${area.areaLabel}-${spec.problem}-${spec.daysAgo}-${slug}-${spec.resolution}-${spec.durationDays}`,
          lat: area.lat,
          lng: area.lng,
          city: area.city,
          areaLabel: area.areaLabel,
          carrierSlug: slug,
          problem: spec.problem,
          resolution: spec.resolution,
          durationDays: spec.durationDays,
          daysAgo: spec.daysAgo,
          weight,
          moderation: "moderated",
        });
      }
    }
  }
}

function markPending(points: HeatPoint[], pendingWeight: number) {
  let remaining = pendingWeight;
  for (const point of points) {
    if (remaining <= 0) break;
    if (point.city !== "zagreb" || point.daysAgo > 7) continue;
    if (point.weight <= remaining) {
      point.moderation = "pending";
      remaining -= point.weight;
      continue;
    }
    points.push({
      ...point,
      id: `${point.id}-pending`,
      weight: remaining,
      moderation: "pending",
    });
    point.weight -= remaining;
    remaining = 0;
  }
  if (remaining !== 0) {
    throw new Error(`Synthetic pending weight left over: ${remaining}`);
  }
}

function sumWhere(points: HeatPoint[], predicate: (point: HeatPoint) => boolean): number {
  return points.reduce((sum, point) => sum + (predicate(point) ? point.weight : 0), 0);
}

function weightedPercentile(points: HeatPoint[], percentile: number): number {
  const sorted = [...points].sort((a, b) => a.durationDays - b.durationDays);
  const total = sorted.reduce((sum, point) => sum + point.weight, 0);
  const target = (percentile / 100) * total;
  let cumulative = 0;
  for (const point of sorted) {
    cumulative += point.weight;
    if (cumulative >= target) return point.durationDays;
  }
  return sorted[sorted.length - 1]?.durationDays ?? 0;
}

function buildHeatPoints(): HeatPoint[] {
  const points: HeatPoint[] = [];
  emitClasses(zagrebCore, zagrebNeighborhoods, points);
  emitClasses(zagrebLonger, zagrebNeighborhoods, points);
  emitClasses(splitCore, splitNeighborhoods, points);
  emitClasses(rijekaCore, rijekaNeighborhoods, points);
  emitClasses(osijekCore, osijekNeighborhoods, points);
  markPending(points, 261);

  const zagreb30 = points.filter((point) => point.city === "zagreb" && point.daysAgo <= 30);
  const zagreb7 = zagreb30.filter((point) => point.daysAgo <= 7);
  const total30 = zagreb30.reduce((sum, point) => sum + point.weight, 0);
  const total7 = zagreb7.reduce((sum, point) => sum + point.weight, 0);
  const delay7 = sumWhere(zagreb7, (point) => point.problem === "delay");
  const problems30 = sumWhere(zagreb30, (point) => point.problem !== "ok");
  const real30 = sumWhere(
    zagreb30,
    (point) => point.problem !== "ok" && point.resolution === "real",
  );
  const pending30 = sumWhere(zagreb30, (point) => point.moderation === "pending");
  const p90 = weightedPercentile(zagreb30, 90);

  if (total30 !== 4102) throw new Error(`Fixture Zagreb 30d n=${total30}, expected 4102`);
  if (total7 !== 1248) throw new Error(`Fixture Zagreb 7d n=${total7}, expected 1248`);
  if (delay7 !== 774) throw new Error(`Fixture 7d delay weight=${delay7}, expected 774`);
  if (problems30 !== 1682) throw new Error(`Fixture problem weight=${problems30}, expected 1682`);
  if (real30 !== 471) throw new Error(`Fixture real-resolution weight=${real30}, expected 471`);
  if (pending30 !== 261) throw new Error(`Fixture pending weight=${pending30}, expected 261`);
  if (p90 !== 6.2) throw new Error(`Fixture p90=${p90}, expected 6.2`);

  return points;
}

export const heatPoints: HeatPoint[] = buildHeatPoints();

export const areaViews: Record<
  "hr" | CityId,
  { center: [number, number]; zoom: number; label: string }
> = {
  hr: { center: [44.95, 16.15], zoom: 7, label: "Hrvatska" },
  zagreb: { center: [45.8, 15.985], zoom: 12, label: "Zagreb" },
  split: { center: [43.508, 16.44], zoom: 12, label: "Split" },
  rijeka: { center: [45.33, 14.435], zoom: 13, label: "Rijeka" },
  osijek: { center: [45.551, 18.693], zoom: 12, label: "Osijek" },
};

export const homeLabelAllowlist = ["Centar", "Novi Zagreb"];
export const mapLabelAllowlist = ["Trešnjevka", "Trnje", "Dugave", "Bačvice", "Centar", "Jug"];
