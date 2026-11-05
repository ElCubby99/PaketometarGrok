import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { EqualBlocks } from "@/components/EqualBlocks";
import { FixtureNote } from "@/components/FixtureNote";
import { GaugeStrip } from "@/components/GaugeStrip";
import { SiteFooter } from "@/components/SiteFooter";
import { carriers, getCarrier } from "@/data/carriers";
import { formatCount, formatDays } from "@/data/format";

type CarrierPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return carriers.map((carrier) => ({ slug: carrier.slug }));
}

export async function generateMetadata({ params }: CarrierPageProps): Promise<Metadata> {
  const { slug } = await params;
  const carrier = getCarrier(slug);
  if (!carrier) return { title: "Prijevoznik" };
  return { title: `${carrier.name} — dosje prijevoznika` };
}

export default async function CarrierPage({ params }: CarrierPageProps) {
  const { slug } = await params;
  const carrier = getCarrier(slug);
  if (!carrier) notFound();

  const others = carriers.filter((item) => item.slug !== carrier.slug);

  return (
    <>
      <main className="page" id="main" tabIndex={-1}>
        <p className="tagline">Dosje prijevoznika · ne ljestvica sramote</p>
        <FixtureNote>
          Sintetički dosje za sučelje v1. Brojke i službeni odgovor nisu stvarna opažanja niti
          izjava tvrtke.
        </FixtureNote>

        <div className="dossier-header">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="carrier-mark" aria-hidden="true">
              {carrier.shortCode}
            </div>
            <div>
              <h1 className="display page-title" style={{ marginBottom: 4 }}>
                {carrier.name}
              </h1>
              <p className="meta" style={{ margin: 0 }}>
                {carrier.windowLabel} · <span className="data">n = {formatCount(carrier.sampleSize)}</span>{" "}
                · <Badge variant="moderated">agregat</Badge>
              </p>
            </div>
          </div>
          <Link className="btn btn--secondary" href="/report">
            Prijavi iskustvo s {carrier.name}
          </Link>
        </div>

        <EqualBlocks>
          <section className="panel panel--pad stack" aria-labelledby="metrics-title" style={{ marginBottom: "var(--space-4)" }}>
            <h2 id="metrics-title" className="h2">
              Mjerne ploče
            </h2>
            <p className="meta" style={{ margin: 0 }}>
              Kalibrirani indikatori iz prijava. Nisu „zvjezdice“.
            </p>

            <div className="metric-panel">
              <h3 className="metric-panel__title">Udio prijava s problemom</h3>
              <p className="metric-panel__figure">
                {carrier.problemShare}
                <span className="metric-panel__unit">%</span>
              </p>
              <GaugeStrip
                value={carrier.problemShare}
                stops={["0%", "50%", "100%"]}
                ariaLabel="Udio prijava s problemom"
              />
            </div>

            <div className="metric-panel">
              <h3 className="metric-panel__title">Trajanje isporuke · p90</h3>
              <p className="metric-panel__figure">
                {formatDays(carrier.p90Days)}
                <span className="metric-panel__unit"> dana</span>
              </p>
              <GaugeStrip
                value={Math.min(100, (carrier.p90Days / 10) * 100)}
                stops={["0", "5", "10"]}
                ariaLabel="Trajanje isporuke, p90"
              />
            </div>

            <div className="metric-panel">
              <h3 className="metric-panel__title">Stopa stvarnog rješavanja</h3>
              <p className="metric-panel__figure">
                {carrier.resolutionRate}
                <span className="metric-panel__unit">%</span>
              </p>
              <GaugeStrip
                value={carrier.resolutionRate}
                stops={["0%", "50%", "100%"]}
                ariaLabel="Stopa stvarnog rješavanja"
              />
            </div>
          </section>

          <section className="panel panel--pad stack" aria-labelledby="reply-title" style={{ marginBottom: "var(--space-4)" }}>
            <h2 id="reply-title" className="h2">
              Pravo odgovora tvrtke
            </h2>
            <p className="meta" style={{ margin: 0 }}>
              Isti vizualni prostor kao mjerne ploče. Odgovor prijevoznika nije manji ni skriven.
            </p>
            <div className="panel reply-card">
              <p style={{ margin: "0 0 var(--space-2)" }}>
                <strong>{carrier.reply.org}</strong>{" "}
                <Badge>službeni odgovor</Badge>
              </p>
              <p style={{ margin: 0 }}>{carrier.reply.body}</p>
              <p className="meta" style={{ margin: "var(--space-2) 0 0" }}>
                Objavljeno: {carrier.reply.publishedAt} · Europska/Zagreb
              </p>
            </div>
            <p className="form-hint" style={{ margin: 0 }}>
              Prijevoznici mogu zatražiti prostor za odgovor putem notice-and-takedown / right-of-reply
              postupka (<Link href="/about#takedown">više u O projektu</Link>). Tekst u ovom bloku je
              sintetički uzorak sučelja.
            </p>
          </section>
        </EqualBlocks>

        <section className="panel panel--pad" aria-labelledby="claims-title">
          <h2 id="claims-title" className="h2">
            Navodi koji zahtijevaju oprez
          </h2>
          <p className="meta">
            Pojedinačne prijave o krađi ili nepravilnosti nose oznaku — nisu dokazane činjenice.
            Nikad ne prikazujemo imena pojedinaca kao počinitelja.
          </p>
          <ul className="claim-list">
            {carrier.claims.map((claim) => (
              <li key={`${claim.date}-${claim.area}`}>
                <div className="row">
                  <Badge variant="unverified">prijavljeno / navodno, neprovjereno</Badge>
                  <span className="data meta">
                    {claim.date} · {claim.area}
                  </span>
                </div>
                <span>{claim.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="meta" style={{ marginTop: "var(--space-4)" }}>
          Ostali dosjei (sintetički uzorak):{" "}
          {others.map((item, index) => (
            <span key={item.slug}>
              {index > 0 ? " · " : null}
              <Link href={`/carriers/${item.slug}`}>{item.name}</Link>
            </span>
          ))}
        </p>
      </main>
      <SiteFooter
        note="Dosje format — jednako pravo odgovora."
        links={[
          { href: "/about", label: "Metodologija" },
          { href: "/about#takedown", label: "Notice-and-takedown" },
          { href: "/escalations", label: "Eskalacija" },
        ]}
      />
    </>
  );
}
