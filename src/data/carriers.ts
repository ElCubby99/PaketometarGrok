import type { CarrierDossier, CarrierSlug } from "./types";

/**
 * SYNTHETIC carrier dossiers for the v1 UI.
 * Readings and replies are written for the interface. They are not measurements
 * of the named companies and not statements those companies have made.
 */
export const carriers: CarrierDossier[] = [
  {
    slug: "gls",
    name: "GLS",
    shortCode: "GLS",
    sampleSize: 892,
    windowLabel: "Uzorak HR · 30 dana",
    problemShare: 37,
    p90Days: 5.4,
    resolutionRate: 31,
    reply: {
      org: "GLS Hrvatska",
      body: "Pratimo agregate Paketometra i istražujemo obrasce kašnjenja na području Zagreba. Pozivamo korisnike da koriste službeni kanal reklamacija; odgovaramo na verificirane eskalacije u roku od 5 radnih dana.",
      publishedAt: "2026-09-02",
    },
    claims: [
      {
        date: "2026-09-10",
        area: "Zagreb (agregat)",
        text: "Prijava: paket označen kao isporučen, primatelj nije zaprimio. Bez dokaza u dosjeu.",
      },
      {
        date: "2026-08-28",
        area: "Split (agregat)",
        text: "Prijava: oštećen sadržaj; reklamacija u tijeku kod pošiljatelja.",
      },
    ],
  },
  {
    slug: "hrvatska-posta",
    name: "Hrvatska pošta",
    shortCode: "HP",
    sampleSize: 1204,
    windowLabel: "Uzorak HR · 30 dana",
    problemShare: 44,
    p90Days: 7.1,
    resolutionRate: 26,
    reply: {
      org: "Hrvatska pošta",
      body: "Agregirane prijave čitamo kao ulaz u praćenje rokova, ne kao rang-listu. Verificirane eskalacije preusmjeravamo u službeni postupak reklamacije. Molimo da se pojedinačni predmeti ne vežu uz imena zaposlenika.",
      publishedAt: "2026-08-19",
    },
    claims: [
      {
        date: "2026-09-04",
        area: "Osijek (agregat)",
        text: "Prijava: isporuka dulja od najavljenog roka. Rješavanje označeno kao generički odgovor.",
      },
      {
        date: "2026-08-11",
        area: "Zagreb (agregat)",
        text: "Prijava: sadržaj navodno nije predan primatelju. Oznaka ostaje neprovjerena.",
      },
    ],
  },
  {
    slug: "dpd",
    name: "DPD",
    shortCode: "DPD",
    sampleSize: 760,
    windowLabel: "Uzorak HR · 30 dana",
    problemShare: 39,
    p90Days: 5.8,
    resolutionRate: 29,
    reply: {
      org: "DPD Hrvatska",
      body: "Uspoređujemo agregate s internim dnevnikom isporuke na razini područja. Na moderirane eskalacije odgovaramo kroz službeni kanal. Dosje nije zamjena za reklamaciju pošiljatelju.",
      publishedAt: "2026-08-22",
    },
    claims: [
      {
        date: "2026-08-22",
        area: "Split (agregat)",
        text: "Prijava: nedostava uz status isporučeno. Nema imena i nema dokaza u ovom dosjeu.",
      },
      {
        date: "2026-07-30",
        area: "Rijeka (agregat)",
        text: "Prijava: oštećenje ambalaže. Reklamacija još nije zatvorena.",
      },
    ],
  },
  {
    slug: "dhl",
    name: "DHL",
    shortCode: "DHL",
    sampleSize: 418,
    windowLabel: "Uzorak HR · 30 dana",
    problemShare: 22,
    p90Days: 3.4,
    resolutionRate: 48,
    reply: {
      org: "DHL",
      body: "Paketometar čitamo kao vanjski agregat iskustava. Službeni odgovor odnosi se na obrasce, ne na pojedinačne pošiljke. Verificirane obavijesti obrađujemo u roku koji je naveden u našem postupku reklamacija.",
      publishedAt: "2026-09-01",
    },
    claims: [
      {
        date: "2026-09-06",
        area: "Zagreb (agregat)",
        text: "Prijava: kašnjenje na carinskom koraku. Status rješavanja još je u tijeku.",
      },
    ],
  },
  {
    slug: "tisak-overseas",
    name: "Overseas / Tisak",
    shortCode: "OVS",
    sampleSize: 533,
    windowLabel: "Uzorak HR · 30 dana",
    problemShare: 35,
    p90Days: 6.0,
    resolutionRate: 27,
    reply: {
      org: "Overseas / Tisak",
      body: "Pratimo agregirani signal po područjima preuzimanja. Odgovor na dosjeu ima isti prostor kao mjerne ploče. Pojedinačne prijave bez verifikacije ostaju označene kao navod.",
      publishedAt: "2026-08-14",
    },
    claims: [
      {
        date: "2026-08-18",
        area: "Zagreb (agregat)",
        text: "Prijava: paket preuzet u ormariću kasnije od najave. Bez identifikacije osobe.",
      },
    ],
  },
  {
    slug: "boxnow",
    name: "BoxNow",
    shortCode: "BOX",
    sampleSize: 295,
    windowLabel: "Uzorak HR · 30 dana",
    problemShare: 18,
    p90Days: 2.6,
    resolutionRate: 61,
    reply: {
      org: "BoxNow",
      body: "Ormarići mjerimo kroz vrijeme do preuzimanja i udio prijava da spremnik nije bio dostupan. Verificirane eskalacije dobivaju odgovor u istom bloku dosjea. Ne objavljujemo lokaciju točniju od agregata.",
      publishedAt: "2026-09-08",
    },
    claims: [
      {
        date: "2026-09-03",
        area: "Rijeka (agregat)",
        text: "Prijava: obavijest o dostavi stigla, spremnik nije bio dostupan. Navod je neprovjeren.",
      },
    ],
  },
];

const bySlug = new Map(carriers.map((carrier) => [carrier.slug, carrier]));

export function getCarrier(slug: string): CarrierDossier | undefined {
  return bySlug.get(slug as CarrierSlug);
}

export function carrierName(slug: CarrierSlug): string {
  return bySlug.get(slug)?.name ?? slug;
}
