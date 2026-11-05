"use client";

import { useId } from "react";

export function MapFrame({
  title,
  chrome,
  footer,
  variant = "default",
  children,
}: {
  title: string;
  chrome: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "preview" | "tall";
  children: React.ReactNode;
}) {
  const titleId = useId();
  const frameClass = [
    "map-frame",
    variant === "tall" ? "map-frame--tall" : "",
    variant === "preview" ? "map-frame--preview" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="panel proof-map" style={{ padding: 0, overflow: "hidden" }} aria-labelledby={titleId}>
      <div className="instrument-chrome">{chrome}</div>
      <h2 id={titleId} className="sr-only">
        {title}
      </h2>
      <div className={frameClass}>
        <div className="map-canvas">{children}</div>
      </div>
      {footer ? <div className="map-footer">{footer}</div> : null}
    </section>
  );
}
