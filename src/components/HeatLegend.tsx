export function HeatLegend({ caption }: { caption?: string }) {
  return (
    <div className="stack">
      <div className="heat-legend">
        <span className="meta">Intenzitet</span>
        <div className="heat-legend__bar" role="img" aria-label="Skala intenziteta od niskog do tlaka" />
      </div>
      <div className="heat-legend__labels">
        <span>nisko</span>
        <span>srednje</span>
        <span>visoko</span>
        <span>tlak</span>
      </div>
      {caption ? (
        <p className="meta" style={{ margin: 0 }}>
          {caption}
        </p>
      ) : null}
    </div>
  );
}
