"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { carriers } from "@/data/carriers";
import type { ExperienceReport, ProblemType, ReportOutcome, ReportResolution } from "@/data/types";
import { Badge } from "./Badge";
import { CheckboxRow } from "./CheckboxRow";
import { ChoiceCard } from "./ChoiceCard";
import { StepProgress } from "./StepProgress";

const problemOptions: { id: ProblemType; label: string }[] = [
  { id: "ok", label: "Sve u redu" },
  { id: "delay", label: "Kašnjenje" },
  { id: "damage", label: "Oštećenje" },
  { id: "non-delivery", label: "Nedostava" },
  { id: "wrong-address", label: "Pogrešna adresa" },
  { id: "communication", label: "Komunikacija" },
];

const resolutionOptions: { id: ReportResolution; label: string }[] = [
  { id: "not-needed", label: "Nije bilo potrebe" },
  { id: "in-progress", label: "U tijeku" },
  { id: "resolved-real", label: "Riješeno stvarno" },
  { id: "generic", label: "Generički odgovor" },
  { id: "rejected", label: "Odbijena reklamacija" },
];

function carrierLabel(slug: string): string {
  if (!slug) return "nije odabrano";
  if (slug === "unknown") return "Drugo / ne znam";
  return carriers.find((carrier) => carrier.slug === slug)?.name ?? slug;
}

function problemLabel(id: ProblemType): string {
  return problemOptions.find((option) => option.id === id)?.label ?? id;
}

function resolutionLabel(id: ReportResolution): string {
  return resolutionOptions.find((option) => option.id === id)?.label ?? id;
}

export function ReportForm() {
  const [step, setStep] = useState(1);
  const [outcome, setOutcome] = useState<ReportOutcome>("ok");
  const [carrier, setCarrier] = useState("");
  const [shippedOn, setShippedOn] = useState("");
  const [deliveredOn, setDeliveredOn] = useState("");
  const [area, setArea] = useState("");
  const [merchant, setMerchant] = useState("");
  const [problems, setProblems] = useState<ProblemType[]>(["ok"]);
  const [resolution, setResolution] = useState<ReportResolution>("not-needed");
  const [notes, setNotes] = useState("");
  const [policeReported, setPoliceReported] = useState(false);
  const [email, setEmail] = useState("");
  const [consentEdit, setConsentEdit] = useState(false);
  const [consentBcc, setConsentBcc] = useState(false);
  const [submitted, setSubmitted] = useState<ExperienceReport | null>(null);
  const legendRef = useRef<HTMLLegendElement>(null);
  const skipFocus = useRef(true);

  useEffect(() => {
    if (skipFocus.current) {
      skipFocus.current = false;
      return;
    }
    legendRef.current?.focus();
  }, [step]);

  function goTo(next: number) {
    setStep(next);
  }

  function chooseOutcome(next: ReportOutcome) {
    setOutcome(next);
    if (next === "ok") {
      setProblems(["ok"]);
      setResolution("not-needed");
      return;
    }
    setProblems((current) => {
      const kept = current.filter((item) => item !== "ok");
      return kept.length > 0 ? kept : ["delay"];
    });
    setResolution((current) => (current === "not-needed" ? "in-progress" : current));
  }

  function toggleProblem(id: ProblemType) {
    setProblems((current) => {
      if (id === "ok") return current.length === 1 && current[0] === "ok" ? [] : ["ok"];
      const withoutOk = current.filter((item) => item !== "ok" && item !== id);
      if (current.includes(id)) return withoutOk;
      return [...withoutOk, id];
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 4) {
      goTo(step + 1);
      return;
    }
    setSubmitted({
      outcome,
      carrierSlug: carrier,
      shippedOn,
      deliveredOn,
      area,
      merchant,
      problemTypes: problems,
      resolution,
      notes,
      policeReported,
      email,
      consentEdit,
      consentBcc,
    });
  }

  function reset() {
    setSubmitted(null);
    setStep(1);
    setOutcome("ok");
    setCarrier("");
    setShippedOn("");
    setDeliveredOn("");
    setArea("");
    setMerchant("");
    setProblems(["ok"]);
    setResolution("not-needed");
    setNotes("");
    setPoliceReported(false);
    setEmail("");
    setConsentEdit(false);
    setConsentBcc(false);
    skipFocus.current = true;
  }

  if (submitted) {
    return (
      <section className="panel panel--pad stack" aria-labelledby="receipt-title">
        <h2 id="receipt-title" className="h2">
          Obrazac je zadržan u pregledniku
        </h2>
        <p style={{ margin: 0 }}>
          Podaci nisu poslani. Ova verzija nema poslužitelj — prijava nije ušla u mjerenje niti u
          eskalaciju.
        </p>
        <ul className="receipt-list">
          <li>
            <span>Ishod</span>
            <span>{submitted.outcome === "ok" ? "Prošla je u redu" : "Bilo je problema"}</span>
          </li>
          <li>
            <span>Prijevoznik</span>
            <span>{carrierLabel(submitted.carrierSlug)}</span>
          </li>
          <li>
            <span>Područje</span>
            <span>{submitted.area || "nije upisano"}</span>
          </li>
          <li>
            <span>Tipovi</span>
            <span>
              {submitted.problemTypes.length
                ? submitted.problemTypes.map(problemLabel).join(", ")
                : "nije odabrano"}
            </span>
          </li>
          <li>
            <span>Rješavanje</span>
            <span>{resolutionLabel(submitted.resolution)}</span>
          </li>
          <li data-field="consent_edit" data-value={submitted.consentEdit ? "yes" : "no"}>
            <span>consent_edit</span>
            <span>{submitted.consentEdit ? "uključeno" : "isključeno"}</span>
          </li>
          <li data-field="consent_bcc" data-value={submitted.consentBcc ? "yes" : "no"}>
            <span>consent_bcc</span>
            <span>{submitted.consentBcc ? "uključeno" : "isključeno"}</span>
          </li>
        </ul>
        {submitted.policeReported ? (
          <p style={{ margin: 0 }}>
            <Badge variant="unverified">prijavljeno / navodno, neprovjereno</Badge>
          </p>
        ) : null}
        <p className="meta" style={{ margin: 0 }}>
          Dvije kućice ostaju neovisne: edit-link {submitted.consentEdit ? "da" : "ne"}, BCC{" "}
          {submitted.consentBcc ? "da" : "ne"}.
        </p>
        <button type="button" className="btn" onClick={reset}>
          Nova prijava
        </button>
      </section>
    );
  }

  return (
    <>
    <StepProgress step={step} />
    <form className="panel panel--pad stack" id="report-form" onSubmit={onSubmit}>
      {step === 1 ? (
        <fieldset className="stack">
          <legend className="h2" tabIndex={-1} ref={legendRef}>
            Kako je prošla dostava?
          </legend>
          <p className="form-hint" style={{ margin: 0 }}>
            Odaberi ishod. Obje su jednako važne za mjerenje.
          </p>
          <div className="choice-grid choice-grid--2" role="group" aria-label="Ishod dostave">
            <ChoiceCard
              title="Prošla je u redu"
              hint="Na vrijeme, neoštećeno, dogovoreno"
              selected={outcome === "ok"}
              onSelect={() => chooseOutcome("ok")}
            />
            <ChoiceCard
              title="Bilo je problema"
              hint="Kašnjenje, oštećenje, nedostava…"
              selected={outcome === "issue"}
              onSelect={() => chooseOutcome("issue")}
            />
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset className="stack">
          <legend className="h2" tabIndex={-1} ref={legendRef}>
            Prijevoznik i trajanje
          </legend>
          <div className="form-group">
            <label htmlFor="carrier">Prijevoznik</label>
            <select
              id="carrier"
              name="carrier"
              value={carrier}
              onChange={(event) => setCarrier(event.target.value)}
            >
              <option value="">Odaberi…</option>
              {carriers.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
              <option value="unknown">Drugo / ne znam</option>
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="shipped">Datum slanja (približno)</label>
              <input
                type="date"
                id="shipped"
                name="shipped"
                value={shippedOn}
                onChange={(event) => setShippedOn(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="delivered">Datum isporuke / pokušaja</label>
              <input
                type="date"
                id="delivered"
                name="delivered"
                value={deliveredOn}
                onChange={(event) => setDeliveredOn(event.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="area">Područje (grad / naselje)</label>
            <input
              type="text"
              id="area"
              name="area"
              value={area}
              placeholder="npr. Zagreb, Trešnjevka"
              autoComplete="address-level2"
              onChange={(event) => setArea(event.target.value)}
            />
            <span className="form-hint">
              Lokacija se na karti prikazuje samo agregatno (~100–250&nbsp;m).
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="merchant">Pošiljatelj / trgovac (opcionalno)</label>
            <input
              type="text"
              id="merchant"
              name="merchant"
              value={merchant}
              placeholder="npr. webshop"
              onChange={(event) => setMerchant(event.target.value)}
            />
          </div>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <fieldset className="stack">
          <legend className="h2" tabIndex={-1} ref={legendRef}>
            Detalji iskustva
          </legend>
          <div className="form-group">
            <span className="form-label" id="problem-label">
              Tip(ovi) — višestruki odabir
            </span>
            <div className="problem-chips" role="group" aria-labelledby="problem-label">
              {problemOptions.map((option) => {
                const active = problems.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`chip chip-btn${active ? " chip--active" : ""}`}
                    aria-pressed={active}
                    onClick={() => toggleProblem(option.id)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="resolution">Status rješavanja</label>
            <select
              id="resolution"
              name="resolution"
              value={resolution}
              onChange={(event) => setResolution(event.target.value as ReportResolution)}
            >
              {resolutionOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Opis (bez imena pojedinaca)</label>
            <textarea
              id="notes"
              name="notes"
              maxLength={2000}
              value={notes}
              placeholder="Što se dogodilo, kako je riješeno…"
              onChange={(event) => setNotes(event.target.value)}
            />
            <span className="form-hint">
              Ne imenuj kurire ili zaposlenike. Za krađu/nepravilnost vrijedi oznaka „prijavljeno /
              neprovjereno“.
            </span>
          </div>
          <CheckboxRow
            plain
            id="police"
            name="police"
            checked={policeReported}
            onChange={setPoliceReported}
            title="Prijavljeno policiji (samo ako vrijedi)"
            hint="Označava se badgeom „navodno, neprovjereno“ dok se ne verificira."
          />
        </fieldset>
      ) : null}

      {step === 4 ? (
        <fieldset className="stack">
          <legend className="h2" tabIndex={-1} ref={legendRef}>
            Kontakt (opcionalno)
          </legend>
          <p className="form-hint" style={{ margin: 0 }}>
            E-mail nije obavezan. Registracija nije potrebna. Svaka svrha ima zasebnu kućicu.
          </p>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              placeholder="ime@primjer.hr"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <CheckboxRow
            id="consent-edit"
            name="consent_edit"
            checked={consentEdit}
            onChange={setConsentEdit}
            title="Pristanak: poveznica za uređivanje prijave"
            hint="Šaljemo jednokratnu poveznicu na ovaj e-mail kako bih mogao/la ispraviti ili povući prijavu. Bez ove kućice ne šaljemo edit-link."
          />
          <CheckboxRow
            id="consent-bcc"
            name="consent_bcc"
            checked={consentBcc}
            onChange={setConsentBcc}
            title="Pristanak: BCC kolektivna eskalacija"
            hint="Ako prijava prođe moderaciju, može ući u agregiranu obavijest prijevozniku (BCC). Bez ove kućice prijava ostaje samo u mjerenju — ne u eskalaciji."
          />
          <p className="meta" style={{ margin: 0 }}>
            Dvije kućice su neovisne. Možeš odabrati samo edit-link, samo BCC, oboje ili nijedno.
          </p>
        </fieldset>
      ) : null}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn--ghost"
          id="btn-prev"
          hidden={step === 1}
          onClick={() => goTo(step - 1)}
        >
          Natrag
        </button>
        <button type="button" className="btn" id="btn-next" hidden={step === 4} onClick={() => goTo(step + 1)}>
          Dalje
        </button>
        <button type="submit" className="btn" id="btn-submit" hidden={step !== 4}>
          Pošalji prijavu
        </button>
      </div>
      <p className="meta" style={{ margin: 0 }}>
        Demo obrazac — ne šalje podatke. Nema poslužitelja u v1.
      </p>
    </form>
    </>
  );
}
