import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { GaugeStrip } from "@/components/GaugeStrip";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "O projektu",
};

export default function AboutPage() {
  return (
    <>
      <main className="page" id="main" tabIndex={-1}>
        <p className="tagline">Metodologija · guardraili · pravo</p>
        <h1 className="display page-title">O projektu</h1>
        <p className="lede">
          Paketometar je nezavisni mjerni instrument: agregira prijave iskustava s dostavom u
          provjerljive obrasce. Nije Trustpilot, nije stup srama.
        </p>

        <nav className="panel toc" aria-label="Sadržaj">
          <Link href="#method">Metodologija</Link>
          <Link href="#guardrails">Guardraili</Link>
          <Link href="#gdpr">GDPR</Link>
          <Link href="#takedown">Notice-and-takedown</Link>
          <Link href="#contact">Kontakt</Link>
        </nav>

        <div className="prose">
          <section id="method" aria-labelledby="method-title">
            <h2 id="method-title" className="h2">
              Metodologija
            </h2>
            <div className="panel panel--pad stack">
              <p style={{ margin: 0 }}>
                Jedinica mjerenja je <strong>prijava iskustva</strong> (pozitivna ili negativna), ne
                „zvjezdica“. Agregati na karti i dosjeima uključuju:
              </p>
              <ul>
                <li>prijevoznika i opcionalnog pošiljatelja/trgovca</li>
                <li>lokaciju samo agregatno (~100–250&nbsp;m)</li>
                <li>datume → trajanje isporuke (uključujući rep: p50 / p90 / p99)</li>
                <li>tip(ove) problema, uključujući „sve u redu“</li>
                <li>status rješavanja (stvarno / generički / odbijeno)</li>
                <li>indikator pouzdanosti / verifikacije uzorka</li>
              </ul>
              <GaugeStrip
                value={75}
                label="Primjer: pouzdanost uzorka (ilustracija)"
                displayValue="visoka"
                stops={["niska", "srednja", "visoka"]}
                ariaLabel="Ilustracija pouzdanosti uzorka"
              />
              <p className="meta" style={{ margin: 0 }}>
                Heatmapa koristi skalu polje → topli mid → gauge → pressure — kalibrirani tlak, ne
                semafor. Brojke u ovoj verziji su sintetički uzorak.
              </p>
            </div>
          </section>

          <section id="guardrails" aria-labelledby="guardrails-title">
            <h2 id="guardrails-title" className="h2">
              Guardraili u sučelju
            </h2>
            <div className="panel panel--pad">
              <ul>
                <li>
                  Badge <Badge variant="unverified">prijavljeno / navodno, neprovjereno</Badge> za
                  krađe i nepravilnosti
                </li>
                <li>Nikad imena pojedinaca kao počinitelja</li>
                <li>Lokacije samo agregatno</li>
                <li>Indikator pouzdanosti / verifikacije uz brojke</li>
                <li>Company right-of-reply ravnopravan mjernim pločama</li>
                <li>
                  Eskalacija samo iz moderiranih / verificiranih prijava s eksplicitnim BCC
                  pristankom
                </li>
                <li>E-mail pristanke eksplicitni i odvojeni (edit-link ≠ BCC)</li>
              </ul>
            </div>
          </section>

          <section id="gdpr" aria-labelledby="gdpr-title">
            <h2 id="gdpr-title" className="h2">
              GDPR i privatnost
            </h2>
            <div className="panel panel--pad stack">
              <p style={{ margin: 0 }}>
                Prijava može biti potpuno anonimna. E-mail je opcionalan i koristi se samo za svrhe
                za koje si dao/la pristanak (uređivanje prijave i/ili BCC eskalacija).
              </p>
              <ul>
                <li>Pravna osnova: pristanak i legitimni interes za agregiranu statistiku</li>
                <li>Pravo na pristup, ispravak i brisanje — putem edit-linka ili zahtjeva</li>
                <li>Ne prodajemo osobne podatke trećim stranama</li>
                <li>Zadržavanje: agregati mogu ostati; identifikatori se brišu prema politici</li>
              </ul>
              <p className="meta" style={{ margin: 0 }}>
                Ovo je sučelje v1 — produkcijska privatnostna politika dolazi odvojeno. Obrazac ne
                šalje podatke.
              </p>
            </div>
          </section>

          <section id="takedown" aria-labelledby="takedown-title">
            <h2 id="takedown-title" className="h2">
              Notice-and-takedown &amp; pravo odgovora
            </h2>
            <div className="panel panel--pad stack">
              <p style={{ margin: 0 }}>
                Prijevoznici i treće strane mogu prijaviti netočan ili nezakonit sadržaj. Također
                mogu zatražiti prostor za službeni odgovor na dosjeu (ravnopravan blok).
              </p>
              <ul>
                <li>Pošalji obrazloženi zahtjev s ID-om prijave / eskalacije ako postoji</li>
                <li>Moderacija pregledava u razumnom roku</li>
                <li>Uklonjeni ili ispravljeni sadržaj bilježi se u internom dnevniku</li>
              </ul>
              <p style={{ margin: 0 }}>
                Kontakt za zahtjeve (demo): <span className="data">legal@paketometar.com</span>
              </p>
            </div>
          </section>

          <section id="contact" aria-labelledby="contact-title">
            <h2 id="contact-title" className="h2">
              Kontakt i domene
            </h2>
            <div className="panel panel--pad">
              <p style={{ margin: "0 0 var(--space-2)" }}>
                Primarna domena: <strong>paketometar.com</strong> · rezervacija: paketometar.eu
              </p>
              <p className="meta" style={{ margin: 0 }}>
                Jezik sučelja: hrvatski. Arhitektura dopušta lokalizaciju (DE, RS, SI…) bez
                redizajna.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter
        note="Footer-ready: metodologija, GDPR, notice-and-takedown."
        links={[
          { href: "/about#method", label: "Metodologija" },
          { href: "/about#gdpr", label: "GDPR" },
          { href: "/about#takedown", label: "Notice-and-takedown" },
          { href: "/", label: "Naslovnica" },
        ]}
      />
    </>
  );
}
