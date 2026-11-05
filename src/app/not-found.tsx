import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <main className="page" id="main" tabIndex={-1}>
        <p className="tagline">404</p>
        <h1 className="display page-title">Ova stranica nije u instrumentu</h1>
        <p className="lede">Adresa ne vodi na prijavu, kartu ni dosje.</p>
        <Link className="btn" href="/">
          Natrag na naslovnicu
        </Link>
      </main>
      <SiteFooter
        note="Nezavisni mjerni instrument dostave."
        links={[
          { href: "/map", label: "Karta" },
          { href: "/report", label: "Prijava" },
          { href: "/about", label: "O projektu" },
        ]}
      />
    </>
  );
}
