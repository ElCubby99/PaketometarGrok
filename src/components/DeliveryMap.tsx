"use client";

import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import type { MapBlob } from "@/data/types";

type DeliveryMapProps = {
  blobs: MapBlob[];
  center: [number, number];
  zoom: number;
  ariaLabel: string;
  scrollWheelZoom?: boolean;
};

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

type LeafletApi = typeof import("leaflet");

function leafletApi(mod: LeafletApi): LeafletApi {
  const withDefault = mod as LeafletApi & { default?: LeafletApi };
  return withDefault.default ?? mod;
}

function heatRadius(zoom: number, intensity: number): number {
  const base = 78 + intensity * 86;
  return Math.max(22, base * Math.pow(1.45, zoom - 12));
}

function drawHeatBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  intensity: number,
) {
  const core = intensity >= 0.72 ? "139,46,36" : intensity >= 0.48 ? "184,106,30" : "201,184,154";
  const mid = intensity >= 0.72 ? "184,106,30" : "201,184,154";
  const alpha = 0.28 + intensity * 0.42;
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(${core}, ${alpha})`);
  gradient.addColorStop(0.42, `rgba(${mid}, ${alpha * 0.55})`);
  gradient.addColorStop(1, "rgba(201,184,154, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function mountHeat(L: LeafletApi, map: LeafletMap, blobs: MapBlob[]): () => void {
  const canvas = L.DomUtil.create("canvas", "paketometar-heat") as HTMLCanvasElement;
  canvas.style.pointerEvents = "none";
  map.getPanes().overlayPane.appendChild(canvas);

  const redraw = () => {
    const size = map.getSize();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(size.x * ratio));
    canvas.height = Math.max(1, Math.round(size.y * ratio));
    canvas.style.width = `${size.x}px`;
    canvas.style.height = `${size.y}px`;
    L.DomUtil.setPosition(canvas, map.containerPointToLayerPoint([0, 0]));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, size.x, size.y);
    const zoom = map.getZoom();
    for (const blob of blobs) {
      const point = map.latLngToContainerPoint([blob.lat, blob.lng]);
      drawHeatBlob(ctx, point.x, point.y, heatRadius(zoom, blob.intensity), blob.intensity);
    }
  };

  map.on("move zoom resize viewreset", redraw);
  redraw();
  return () => {
    map.off("move zoom resize viewreset", redraw);
    canvas.remove();
  };
}

function paint(
  L: LeafletApi,
  map: LeafletMap,
  layerRef: { current: LayerGroup | null },
  heatRef: { current: (() => void) | null },
  blobs: MapBlob[],
) {
  heatRef.current?.();
  heatRef.current = mountHeat(L, map, blobs);
  layerRef.current?.remove();
  const layer = L.layerGroup().addTo(map);
  layerRef.current = layer;

  for (const blob of blobs) {
    if (!blob.label) continue;
    const icon = L.divIcon({
      className: "leaflet-div-icon map-label-icon",
      html: `<span class="map-label">${escapeHtml(blob.label)}</span>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
    L.marker([blob.lat, blob.lng], {
      icon,
      interactive: false,
      keyboard: false,
    }).addTo(layer);
  }
}

export function DeliveryMap({
  blobs,
  center,
  zoom,
  ariaLabel,
  scrollWheelZoom = false,
}: DeliveryMapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const heatRef = useRef<(() => void) | null>(null);
  const reduceRef = useRef(false);
  const viewRef = useRef<string>("");
  const [ready, setReady] = useState(false);
  const blobsRef = useRef(blobs);
  blobsRef.current = blobs;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let map: LeafletMap | null = null;
    let observer: ResizeObserver | null = null;

    (async () => {
      const L = leafletApi(await import("leaflet"));
      if (cancelled || !hostRef.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      reduceRef.current = reduce;
      map = L.map(host, {
        zoomControl: false,
        scrollWheelZoom,
        fadeAnimation: !reduce,
        zoomAnimation: !reduce,
        markerZoomAnimation: !reduce,
        keyboard: true,
      }).setView(center, zoom);
      L.control.zoom({ zoomInTitle: "Povećaj", zoomOutTitle: "Smanji" }).addTo(map);
      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);
      map.attributionControl.setPrefix(
        '<a href="https://leafletjs.com" title="Leaflet" rel="noopener noreferrer">Leaflet</a>',
      );
      const container = map.getContainer();
      container.setAttribute("aria-label", ariaLabel);
      container.dataset.zoomAnimation = reduce ? "off" : "on";
      mapRef.current = map;
      viewRef.current = `${center[0]},${center[1]},${zoom}`;
      paint(L, map, layerRef, heatRef, blobsRef.current);
      observer = new ResizeObserver(() => {
        map?.invalidateSize();
      });
      observer.observe(host);
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      heatRef.current?.();
      heatRef.current = null;
      layerRef.current?.remove();
      layerRef.current = null;
      map?.remove();
      mapRef.current = null;
      setReady(false);
    };
    // Leaflet instance is created once per mount. View and blobs update below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollWheelZoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    let cancelled = false;
    const key = `${center[0]},${center[1]},${zoom}`;
    if (viewRef.current !== key) {
      viewRef.current = key;
      if (reduceRef.current) map.setView(center, zoom, { animate: false });
      else map.flyTo(center, zoom, { duration: 0.45 });
    }
    (async () => {
      const L = leafletApi(await import("leaflet"));
      if (cancelled || !mapRef.current) return;
      paint(L, mapRef.current, layerRef, heatRef, blobs);
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, blobs, center, zoom]);

  useEffect(() => {
    mapRef.current?.getContainer().setAttribute("aria-label", ariaLabel);
  }, [ariaLabel, ready]);

  return <div ref={hostRef} className="leaflet-host" />;
}
