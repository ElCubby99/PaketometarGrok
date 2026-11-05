import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { plexMono, plexSans } from "@/fonts/ibm-plex";
import { localeTag } from "@/i18n/locale";
import "leaflet/dist/leaflet.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/pages.css";
import "@/styles/leaflet.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://paketometar.com"),
  title: {
    default: "Paketometar — mjerenje dostave",
    template: "%s — Paketometar",
  },
  description:
    "Paketometar agregira pojedinačna iskustva dostave u provjerljive obrasce. Mjerni instrument, ne recenzijska stranica.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D9E2E8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={localeTag} className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <div className="page-shell">
          <a className="skip-link" href="#main">
            Preskoči na sadržaj
          </a>
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
