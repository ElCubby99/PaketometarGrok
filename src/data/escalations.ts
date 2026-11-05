import type { EscalationBatchRecord, EscalationLogRow } from "./types";

/**
 * SYNTHETIC escalation log.
 * Batches below are interface fixtures. They were not sent to any carrier.
 */

export const activeBatch: EscalationBatchRecord = {
  id: "ESC-2026-09-014",
  carrierName: "GLS",
  count: 48,
  threshold: 100,
  area: "Zagreb (agregat)",
  focus: "kašnjenje + generičko rješavanje",
  period: "2026-08-20 — 2026-09-15",
};

export const escalationLog: EscalationLogRow[] = [
  {
    id: "ESC-2026-08-009",
    carrierName: "DPD",
    count: 52,
    focus: "Nedostava · Split",
    statusLabel: "poslano",
    date: "2026-08-22",
  },
  {
    id: "ESC-2026-07-004",
    carrierName: "Hrvatska pošta",
    count: 67,
    focus: "Kašnjenje · Osijek",
    statusLabel: "odgovoreno",
    date: "2026-07-18",
  },
  {
    id: "ESC-2026-06-011",
    carrierName: "GLS",
    count: 41,
    focus: "Oštećenje · Rijeka",
    statusLabel: "zatvoreno",
    date: "2026-06-30",
  },
];
