import { DeliveryMap } from "@/components/DeliveryMap";
import { FixtureNote } from "@/components/FixtureNote";
import { GaugeStrip } from "@/components/GaugeStrip";
import { HeatLegend } from "@/components/HeatLegend";
import { MapFrame } from "@/components/MapFrame";
import { SiteFooter } from "@/components/SiteFooter";
import { areaViews, homeLabelAllowlist } from "@/data/fixtures";
import { formatCount } from "@/data/format";
import { blobsFromPoints, homePreviewPoints, homePreviewReadout } from "@/data/metrics";
import Link from "next/link";

const previewBlobs = blobsFromPoints(homePreviewPoints, homeLabelAllowlist);

export default function HomePage() {
  const zagreb = areaViews.zagreb;
  return (
    <>
      <main className="page" id="main" tabIndex={-1}>
        <div className="hero-instrument">
          <section aria-labelledby="home-title">
            <p className="tagline">Mjerni instrument · HR</p>
            <h1 id="home-title" className="display">
              Mjeri stvarno ponašanje dostave
            </h1>
            <p className="lede">
              Paketometar agregira pojedinačna iskustva u provjerljive obrasce — kao barometar, ne
              kao stranica sa zvjezdicama. Pregledaj kartu problema ili prijavi svoju dostavu.
            </p>

            <div className="panel stack">
              <GaugeStrip
                value={homePreviewReadout.delayShare}
                label="Uzorak · udio kašnjenja (7 dana)"
                displayValue={`${homePreviewReadout.delayShare}%`}
                stops={["0%", "50%", "100%"]}
                ariaLabel="Uzorak: udio prijava s kašnjenjem u uzorku"
              />
              <p className="meta" style={{ margin: 0 }}>
                Brojke su agregati iz prijava, ne „ocjene“ prijevoznika. Lokacije su zaokružene
                (~100–250&nbsp;m).
              </p>
            </div>

            <FixtureNote />

            <div className="cta-row">
              <Link className="btn" href="/report">
                Prijavi iskustvo
              </Link>
              <Link className="btn btn--secondary" href="/map">
                Otvori kartu
              </Link>
            </div>
          </section>

          <MapFrame
            variant="preview"
            title="Pregled heatmape problema"
            chrome={
              <>
                <span>
                  <span className="live-dot" aria-hidden="true" />
                  Pregled karte · Zagreb · sintetički uzorak
                </span>
                <span className="data">n = {formatCount(homePreviewReadout.sampleSize)}</span>
              </>
            }
            footer={
              <HeatLegend caption="Ljestvica: polje → topli mid → gauge → pressure. Nije semafor zeleno/crveno." />
            }
          >
            <DeliveryMap
              blobs={previewBlobs}
              center={zagreb.center}
              zoom={zagreb.zoom}
              ariaLabel="Pregled heatmape: intenzitet prijava po područjima Zagreba. Sintetički uzorak."
            />
          </MapFrame>
        </div>

        <section aria-labelledby="how-title" className="stack" style={{ marginTop: "var(--space-5)" }}>
          <h2 id="how-title" className="h2">
            Kako doprinosiš mjerenju
          </h2>
          <ol className="how-list">
            <li>
              <span className="how-list__n" aria-hidden="true">
                1
              </span>
              <div>
                <strong>Prijavi iskustvo</strong>
                <p className="meta" style={{ margin: "4px 0 0" }}>
                  Pozitivno ili negativno — jednako važno. Bez registracije.
                </p>
              </div>
            </li>
            <li>
              <span className="how-list__n" aria-hidden="true">
                2
              </span>
              <div>
                <strong>Agregacija u obrasce</strong>
                <p className="meta" style={{ margin: "4px 0 0" }}>
                  Pojedinačne prijave ulaze u mjerne ploče i kartu, ne u rang-listu sramote.
                </p>
              </div>
            </li>
            <li>
              <span className="how-list__n" aria-hidden="true">
                3
              </span>
              <div>
                <strong>Provjerljiv kontekst</strong>
                <p className="meta" style={{ margin: "4px 0 0" }}>
                  Svaka brojka nosi uzorak, razdoblje i status verifikacije.
                </p>
              </div>
            </li>
          </ol>
        </section>
      </main>
      <SiteFooter
        note="Nezavisni mjerni instrument dostave. Nije recenzijska platforma."
        links={[
          { href: "/about", label: "Metodologija" },
          { href: "/about#gdpr", label: "GDPR" },
          { href: "/about#takedown", label: "Notice-and-takedown" },
          { href: "/escalations", label: "Eskalacija" },
        ]}
      />
    </>
  );
}
