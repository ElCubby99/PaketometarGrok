import { GaugeStrip } from "./GaugeStrip";

const stepNames = ["Ishod dostave", "Prijevoznik", "Detalji", "Kontakt"] as const;

export function StepProgress({ step, total = 4 }: { step: number; total?: number }) {
  const name = stepNames[step - 1] ?? "";
  return (
    <div className="step-progress" aria-label="Napredak obrasca">
      <div className="step-progress__meta" aria-live="polite">
        <span>
          Korak <strong>{step}</strong> / {total}
        </span>
        <span className="data">{name}</span>
      </div>
      <GaugeStrip
        variant="progress"
        value={(step / total) * 100}
        stops={["1", "2", "3", "4"]}
        tickCount={5}
        ariaLabel={`Korak ${step} od ${total}: ${name}`}
      />
    </div>
  );
}
