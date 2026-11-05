"use client";

import { useMemo, useState } from "react";
import { areaViews, heatPoints, mapLabelAllowlist } from "@/data/fixtures";
import { formatCount, formatDays } from "@/data/format";
import { blobsFromPoints, computeMetrics, defaultFilters, filterHeatPoints } from "@/data/metrics";
import type { MapFilters } from "@/data/types";
import { DeliveryMap } from "./DeliveryMap";
import { FilterSidebar } from "./FilterSidebar";
import { GaugeStrip } from "./GaugeStrip";
import { MapFrame } from "./MapFrame";
import { MetricPanel } from "./MetricPanel";

const timeChrome: Record<MapFilters["time"], string> = {
  "7d": "7 dana",
  "30d": "30 dana",
  "90d": "90 dana",
  "2026": "2026.",
};

const tailLabel: Record<MapFilters["tail"], string> = {
  p50: "p50",
  p90: "p90",
  p99: "p99",
};

export function MapExplorer() {
  const [filters, setFilters] = useState<MapFilters>(defaultFilters);
  const points = useMemo(() => filterHeatPoints(heatPoints, filters), [filters]);
  const metrics = useMemo(() => computeMetrics(points, filters.tail), [points, filters.tail]);
  const blobs = useMemo(() => blobsFromPoints(points, mapLabelAllowlist), [points]);
  const view = areaViews[filters.area];

  return (
    <div className="analytics-layout">
      <FilterSidebar filters={filters} onChange={setFilters} />
      <div className="map-with-panels">
        <MapFrame
          variant="tall"
          title="Puna heatmapa"
          chrome={
            <>
              <span>
                <span className="live-dot" aria-hidden="true" />
                Heatmapa · {view.label} · {timeChrome[filters.time]} · sintetički uzorak
              </span>
              <span className="data">
                n = {formatCount(metrics.sampleSize)} · agregat ~150&nbsp;m
              </span>
            </>
          }
          footer={
            <GaugeStrip
              variant="compact"
              value={70}
              label="Skala intenziteta (kalibrirani tlak)"
              displayValue="visok"
              stops={["polje", "mid", "gauge", "tlak"]}
              ariaLabel="Legenda intenziteta: polje, mid, gauge, tlak"
            />
          }
        >
          <DeliveryMap
            blobs={blobs}
            center={view.center}
            zoom={view.zoom}
            scrollWheelZoom
            ariaLabel={`Heatmapa intenziteta prijava, ${view.label}. Sintetički uzorak, lokacije su agregat.`}
          />
        </MapFrame>

        <section aria-labelledby="panels-title">
          <h2 id="panels-title" className="h2">
            Mjerne ploče
          </h2>
          <p className="meta" style={{ marginTop: 0, marginBottom: "var(--space-3)" }}>
            Agregati za aktivne filtre. Nema rang-liste „najgorih“.
            {metrics.empty ? " Nema ćelija za ovaj presjek." : ""}
          </p>
          <div className="measure-board">
            <MetricPanel
              title="Udio prijava s problemom"
              figure={metrics.empty ? "—" : String(metrics.problemShare)}
              unit={metrics.empty ? undefined : "%"}
              gaugeValue={metrics.problemShare}
            />
            <MetricPanel
              title={`Trajanje · ${tailLabel[filters.tail]} (dani)`}
              figure={metrics.empty ? "—" : formatDays(metrics.durationDays)}
              unit={metrics.empty ? undefined : " d"}
              gaugeValue={metrics.durationPercent}
              stops={["0", "5", "10"]}
            />
            <MetricPanel
              title="Stvarno rješavanje"
              figure={metrics.empty ? "—" : String(metrics.resolutionShare)}
              unit={metrics.empty ? undefined : "%"}
              gaugeValue={metrics.resolutionShare}
            />
            <MetricPanel title="Uzorak (prijave)" figure={formatCount(metrics.sampleSize)}>
              <p className="meta" style={{ margin: 0 }}>
                Moderirano: {formatCount(metrics.moderated)} · U tijeku: {formatCount(metrics.pending)}
              </p>
            </MetricPanel>
          </div>
        </section>
      </div>
    </div>
  );
}
