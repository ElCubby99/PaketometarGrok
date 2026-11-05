import type { Metadata } from "next";
import { ReportForm } from "@/components/ReportForm";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Prijava iskustva",
};

export default function ReportPage() {
  return (
    <>
      <main className="page" id="main" tabIndex={-1}>
        <div className="report-layout">
          <p className="tagline">Obrazac · bez registracije</p>
          <h1 className="display page-title">Prijava iskustva</h1>
          <p className="lede">
            Pozitivna i negativna prijava su ravnopravne. Podaci ulaze u mjerenje, ne u „ocjenu“.
          </p>
          <ReportForm />
        </div>
      </main>
      <SiteFooter
        note="Prijava / iskustvo / obrazac / mjerenje."
        links={[
          { href: "/about", label: "Metodologija" },
          { href: "/about#gdpr", label: "GDPR" },
          { href: "/escalations", label: "Eskalacija" },
        ]}
      />
    </>
  );
}
