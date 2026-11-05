import type { Metadata } from "next";
import Link from "next/link";
import { EscalationBatch } from "@/components/EscalationBatch";
import { EscalationTable } from "@/components/EscalationTable";
import { FixtureNote } from "@/components/FixtureNote";
import { SiteFooter } from "@/components/SiteFooter";
import { activeBatch, escalationLog } from "@/data/escalations";

export const metadata: Metadata = {
  title: "Kolektivna eskalacija",
};

export default function EscalationsPage() {
  return (
    <>
      <main className="page" id="main" tabIndex={-1}>
        <p className="tagline">Kolektivna eskalacija · samo moderirano</p>
        <h1 className="display page-title">Vidljivost agregiranih eskalacija</h1>
        <p className="lede">
          Kad dovoljno verificiranih prijava s BCC pristankom dijeli obrazac, Paketometar šalje
          agregiranu obavijest prijevozniku. Ton je instrumental — mjerenje i signal, ne kampanja
          srama.
        </p>
        <FixtureNote>
          Paketi u ovom prikazu su sintetički uzorak. Ništa nije poslano prijevoznicima.
        </FixtureNote>

        <section className="panel panel--pad stack" style={{ marginBottom: "var(--space-4)" }} aria-labelledby="rules-title">
          <h2 id="rules-title" className="h2">
            Uvjeti ulaska
          </h2>
          <ul className="plain-list">
            <li>Prijava mora proći moderaciju / verifikaciju.</li>
            <li>Korisnik mora označiti zasebnu kućicu BCC pristanka u obrascu.</li>
            <li>Eskalacija je agregat (broj, tip, područje) — bez doxxanja pojedinaca.</li>
            <li>Prijevoznik vidi zbirku, ne javni „stup“.</li>
          </ul>
          <p className="meta" style={{ margin: 0 }}>
            Pristanak se daje u <Link href="/report">obrascu prijave</Link> (odvojeno od edit-linka).
          </p>
        </section>

        <div style={{ marginBottom: "var(--space-4)" }}>
          <EscalationBatch batch={activeBatch} />
        </div>

        <section aria-labelledby="log-title">
          <h2 id="log-title" className="h2">
            Dnevnik (javni sažetak)
          </h2>
          <p className="meta">Samo završene, moderirane eskalacije. Bez osobnih podataka.</p>
          <EscalationTable rows={escalationLog} />
        </section>
      </main>
      <SiteFooter
        note="Eskalacija = instrument, ne mob."
        links={[
          { href: "/about", label: "Guardraili" },
          { href: "/about#gdpr", label: "GDPR" },
          { href: "/report", label: "Prijava" },
        ]}
      />
    </>
  );
}
