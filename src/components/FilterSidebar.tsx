"use client";

import { carriers } from "@/data/carriers";
import type { MapFilters } from "@/data/types";
import { Chip } from "./Chip";

const problemOptions = [
  { id: "all", label: "Svi" },
  { id: "delay", label: "Kašnjenje" },
  { id: "damage", label: "Oštećenje" },
  { id: "non-delivery", label: "Nedostava" },
  { id: "ok", label: "Sve u redu" },
] as const;

const tailOptions = [
  { id: "p50", label: "p50" },
  { id: "p90", label: "p90" },
  { id: "p99", label: "p99" },
] as const;

const resolutionOptions = [
  { id: "all", label: "Sva" },
  { id: "real", label: "Stvarno" },
  { id: "generic", label: "Generički" },
  { id: "rejected", label: "Odbijeno" },
] as const;

const areaOptions = [
  { id: "hr", label: "Hrvatska" },
  { id: "zagreb", label: "Zagreb" },
  { id: "split", label: "Split" },
  { id: "rijeka", label: "Rijeka" },
  { id: "osijek", label: "Osijek" },
] as const;

const timeOptions = [
  { id: "7d", label: "Zadnjih 7 dana" },
  { id: "30d", label: "Zadnjih 30 dana" },
  { id: "90d", label: "Zadnjih 90 dana" },
  { id: "2026", label: "2026." },
] as const;

export function FilterSidebar({
  filters,
  onChange,
}: {
  filters: MapFilters;
  onChange: (next: MapFilters) => void;
}) {
  return (
    <aside className="analytics-layout__filters panel" aria-label="Filtri">
      <h2 className="h3">Filtri</h2>

      <div className="filter-group">
        <span className="form-label" id="filter-problem">
          Tip problema
        </span>
        <div className="chip-wrap" role="group" aria-labelledby="filter-problem">
          {problemOptions.map((option) => (
            <Chip
              key={option.id}
              active={filters.problem === option.id}
              onClick={() => onChange({ ...filters, problem: option.id })}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="form-label" id="filter-tail">
          Rep trajanja isporuke
        </span>
        <div className="chip-wrap" role="group" aria-labelledby="filter-tail">
          {tailOptions.map((option) => (
            <Chip
              key={option.id}
              active={filters.tail === option.id}
              onClick={() => onChange({ ...filters, tail: option.id })}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="form-label" id="filter-resolution">
          Rješavanje
        </span>
        <div className="chip-wrap" role="group" aria-labelledby="filter-resolution">
          {resolutionOptions.map((option) => (
            <Chip
              key={option.id}
              active={filters.resolution === option.id}
              onClick={() => onChange({ ...filters, resolution: option.id })}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="carrier-filter">
          Prijevoznik
        </label>
        <select
          id="carrier-filter"
          value={filters.carrier}
          onChange={(event) =>
            onChange({
              ...filters,
              carrier: event.target.value as MapFilters["carrier"],
            })
          }
        >
          <option value="all">Svi</option>
          {carriers.map((carrier) => (
            <option key={carrier.slug} value={carrier.slug}>
              {carrier.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="area-filter">
          Područje
        </label>
        <select
          id="area-filter"
          value={filters.area}
          onChange={(event) =>
            onChange({
              ...filters,
              area: event.target.value as MapFilters["area"],
            })
          }
        >
          {areaOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="time-filter">
          Vrijeme
        </label>
        <select
          id="time-filter"
          value={filters.time}
          onChange={(event) =>
            onChange({
              ...filters,
              time: event.target.value as MapFilters["time"],
            })
          }
        >
          {timeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
