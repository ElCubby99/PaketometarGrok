import { GaugeStrip } from "./GaugeStrip";

export function MetricPanel({
  title,
  figure,
  unit,
  gaugeValue,
  stops = ["0", "50", "100"],
  children,
}: {
  title: string;
  figure: string;
  unit?: string;
  gaugeValue?: number;
  stops?: string[];
  children?: React.ReactNode;
}) {
  return (
    <article className="panel metric-panel">
      <h3 className="metric-panel__title">{title}</h3>
      <p className="metric-panel__figure">
        {figure}
        {unit ? <span className="metric-panel__unit">{unit}</span> : null}
      </p>
      {gaugeValue !== undefined ? (
        <GaugeStrip value={gaugeValue} stops={stops} ariaLabel={title} />
      ) : null}
      {children}
    </article>
  );
}
