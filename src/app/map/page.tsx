import type { Metadata } from "next";
import { FixtureNote } from "@/components/FixtureNote";
import { MapExplorer } from "@/components/MapExplorer";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Karta i analitika",
};

export default function MapPage() {
  return (
    <>
      <main className="page" id="main" tabIndex={-1}>
        <header className="stack--tight" style={{ marginBottom: "var(--space-4)" }}>
          <p className="tagline">Karta · analitika</p>
          <h1 className="display page-title">Karta problema i mjerne ploče</h1>
          <p className="lede" style={{ marginBottom: 0 }}>
            Filtriraj agregate. Ljestvice su mjerne ploče — ne „TOP 5 najgorih“.
          </p>
          <FixtureNote />
        </header>
        <MapExplorer />
      </main>
      <SiteFooter
        note="Agregati, ne pojedinačne „ocjene“."
        links={[
          { href: "/about", label: "Metodologija" },
          { href: "/about#gdpr", label: "GDPR" },
          { href: "/about#takedown", label: "Notice-and-takedown" },
          { href: "/report", label: "Prijava" },
        ]}
      />
    </>
  );
}
