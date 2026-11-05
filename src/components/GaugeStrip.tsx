import type { CSSProperties } from "react";

type GaugeStripProps = {
  value: number;
  label?: string;
  displayValue?: string;
  stops?: string[];
  tickCount?: number;
  variant?: "default" | "progress" | "compact";
  ariaLabel?: string;
};

export function GaugeStrip({
  value,
  label,
  displayValue,
  stops = ["0%", "50%", "100%"],
  tickCount = 6,
  variant = "default",
  ariaLabel,
}: GaugeStripProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const classes = ["gauge-strip"];
  if (variant === "progress") classes.push("gauge-strip--progress");
  if (variant === "compact") classes.push("gauge-strip--compact");
  const style = { "--gauge-value": String(clamped) } as CSSProperties;

  return (
    <div
      className={classes.join(" ")}
      style={style}
      role="img"
      aria-label={ariaLabel ?? label ?? `Mjera ${Math.round(clamped)} od 100`}
    >
      {label || displayValue ? (
        <div className="gauge-strip__label-row">
          {label ? <span className="gauge-strip__label">{label}</span> : <span />}
          {displayValue ? <span className="gauge-strip__value">{displayValue}</span> : null}
        </div>
      ) : null}
      <div className="gauge-strip__track">
        <div className="gauge-strip__fill" />
        <div className="gauge-strip__ticks" aria-hidden="true">
          {Array.from({ length: tickCount }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="gauge-strip__needle" />
      </div>
      <div className="gauge-strip__scale">
        {stops.map((stop) => (
          <span key={stop}>{stop}</span>
        ))}
      </div>
    </div>
  );
}
