# Paketometar

Croatian delivery-behavior **measurement instrument**. It aggregates individual experiences into patterns. It is not a review site: no star ratings, no shame board.

This repository is the v1 frontend. There is no backend. Every count, heatmap, dossier, and escalation on screen is a **synthetic fixture** written so the interface can be built and reviewed. Those figures are not observations of Hrvatska pošta, GLS, DPD, DHL, Overseas/Tisak, BoxNow, or any other carrier, and the company replies are not statements those companies have made.

Primary vocabulary in the UI: prijava, iskustvo, obrazac, mjerenje.

## Stack

- Next.js App Router + TypeScript
- Locked tokens in `src/styles/tokens.css` (ink, field, panel, grid, gauge, pressure)
- Leaflet + OpenStreetMap tiles only
- IBM Plex Sans and IBM Plex Mono (latin-ext, for Croatian diacritics)
- English component and class names, Croatian visible copy (`src/i18n/locale.ts`)

## Routes

| Path | Page |
| --- | --- |
| `/` | Instrument framing, 7-day gauge, Zagreb heatmap preview |
| `/map` | Filters, full heatmap, measurement panels |
| `/report` | Four-step form. `consent_edit` and `consent_bcc` are independent |
| `/carriers/[slug]` | Dossier. Metrics and company right-of-reply share one row |
| `/escalations` | Moderated collective escalation log (fixture only) |
| `/about` | Methodology, guardrails, GDPR, notice-and-takedown |

Carrier slugs: `hrvatska-posta`, `gls`, `dpd`, `dhl`, `tisak-overseas`, `boxnow`.

## Local setup

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

The map requests tiles from `tile.openstreetmap.org`. Heat coloring uses the locked scale (field → `#C9B89A` → gauge → pressure), not a green/red semaphore.

## Scripts

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Importing `src/data/fixtures.ts` checks the authored Zagreb totals and throws if they drift: 30-day n = 4102, 7-day n = 1248, 7-day delay weight 774 (62%), problem weight 1682 (41%), real resolutions 471 (28%), p90 = 6.2 days, 261 pending.

## Fixture data

| Module | What it is |
| --- | --- |
| `src/data/fixtures.ts` | Aggregate heat cells. Neighborhood centroids only (~100–250 m), never street addresses or personal names |
| `src/data/carriers.ts` | National dossier readings and placeholder right-of-reply text |
| `src/data/escalations.ts` | Escalation batch and log. Nothing here was sent |

`ExperienceReport` in `src/data/types.ts` is the shape a future `POST /reports` could accept. The form keeps that object in the browser and then discards it. Checking a consent box does not transmit email.

## Guardrails in the UI

- Theft or irregularity claims wear the badge „prijavljeno / navodno, neprovjereno“
- No field collects a courier’s or employee’s name
- Escalation copy is limited to moderated, verified, BCC-consented aggregates
- Each email purpose has its own checkbox and its own sentence
- The carrier reply block is the same width as the metric block from 720px up

## Map

`DeliveryMap` mounts Leaflet on the client, draws OpenStreetMap raster tiles, and paints aggregate heat as circle kernels. Zoom control titles are Croatian (Povećaj / Smanji). Attribution stays visible. `prefers-reduced-motion: reduce` turns off Leaflet zoom animation and the header pulse.
