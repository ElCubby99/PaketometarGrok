import type { EscalationBatchRecord } from "@/data/types";
import { Badge } from "./Badge";
import { GaugeStrip } from "./GaugeStrip";

export function EscalationBatch({ batch }: { batch: EscalationBatchRecord }) {
  const value = Math.round((batch.count / batch.threshold) * 100);
  return (
    <section className="panel" style={{ padding: 0, overflow: "hidden" }} aria-labelledby="batch-title">
      <div className="instrument-chrome">
        <span>Aktivni paket eskalacije · sintetički uzorak</span>
        <Badge variant="moderated">moderirano</Badge>
      </div>
      <div className="batch-card">
        <div>
          <h2 id="batch-title" className="h2" style={{ marginBottom: 4 }}>
            {batch.id} · {batch.carrierName}
          </h2>
          <p className="meta" style={{ margin: 0 }}>
            Područje: {batch.area} · Tip: {batch.focus} · Razdoblje: {batch.period}
          </p>
        </div>
        <div className="batch-card__gauge">
          <GaugeStrip
            value={value}
            label="U paket"
            displayValue={`${batch.count} / ${batch.threshold}`}
            stops={["prag", "slanje"]}
            ariaLabel={`Broj prijava u paketu: ${batch.count} od ${batch.threshold}`}
          />
        </div>
      </div>
    </section>
  );
}
