/** Domain types for a future API. v1 is filled only with synthetic fixtures. */

export type CarrierSlug =
  | "hrvatska-posta"
  | "gls"
  | "dpd"
  | "dhl"
  | "tisak-overseas"
  | "boxnow";

export type ProblemType =
  | "ok"
  | "delay"
  | "damage"
  | "non-delivery"
  | "wrong-address"
  | "communication";

/** How a reported problem was closed. `none` is an experience with nothing to resolve. */
export type ResolutionKind = "none" | "real" | "generic" | "rejected";

export type CityId = "zagreb" | "split" | "rijeka" | "osijek";

export type AreaId = "hr" | CityId;

export type TimeWindow = "7d" | "30d" | "90d" | "2026";

export type DurationTail = "p50" | "p90" | "p99";

export type ModerationState = "moderated" | "pending";

export type ReportOutcome = "ok" | "issue";

export type ReportResolution =
  | "not-needed"
  | "in-progress"
  | "resolved-real"
  | "generic"
  | "rejected";

/** One aggregate cell. Coordinates are neighborhood centroids, not addresses. */
export interface HeatPoint {
  id: string;
  lat: number;
  lng: number;
  city: CityId;
  areaLabel: string;
  carrierSlug: CarrierSlug;
  problem: ProblemType;
  resolution: ResolutionKind;
  durationDays: number;
  daysAgo: number;
  weight: number;
  moderation: ModerationState;
}

export interface MapFilters {
  problem: "all" | ProblemType;
  tail: DurationTail;
  resolution: "all" | "real" | "generic" | "rejected";
  carrier: "all" | CarrierSlug;
  area: AreaId;
  time: TimeWindow;
}

export interface MapBlob {
  lat: number;
  lng: number;
  intensity: number;
  label?: string;
}

export interface MetricReadout {
  sampleSize: number;
  moderated: number;
  pending: number;
  problemShare: number;
  durationDays: number;
  durationPercent: number;
  resolutionShare: number;
  empty: boolean;
}

export interface CarrierClaim {
  date: string;
  area: string;
  text: string;
}

export interface CarrierReply {
  org: string;
  body: string;
  publishedAt: string;
}

/** National dossier readings. Authored fixtures, not computed from map cells. */
export interface CarrierDossier {
  slug: CarrierSlug;
  name: string;
  shortCode: string;
  sampleSize: number;
  windowLabel: string;
  problemShare: number;
  p90Days: number;
  resolutionRate: number;
  reply: CarrierReply;
  claims: CarrierClaim[];
}

export interface EscalationBatchRecord {
  id: string;
  carrierName: string;
  count: number;
  threshold: number;
  area: string;
  focus: string;
  period: string;
}

export interface EscalationLogRow {
  id: string;
  carrierName: string;
  count: number;
  focus: string;
  statusLabel: string;
  date: string;
}

/** Payload a future POST /reports endpoint would accept. Nothing sends this in v1. */
export interface ExperienceReport {
  outcome: ReportOutcome;
  carrierSlug: string;
  shippedOn: string;
  deliveredOn: string;
  area: string;
  merchant: string;
  problemTypes: ProblemType[];
  resolution: ReportResolution;
  notes: string;
  policeReported: boolean;
  email: string;
  consentEdit: boolean;
  consentBcc: boolean;
}
