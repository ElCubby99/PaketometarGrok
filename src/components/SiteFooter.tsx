import Link from "next/link";

export function SiteFooter({
  note,
  links,
}: {
  note: string;
  links: { href: string; label: string }[];
}) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>Paketometar</strong>
          <p className="meta" style={{ margin: "4px 0 0" }}>
            {note}
          </p>
        </div>
        <nav className="footer-nav" aria-label="Podnožje">
          {links.map((link) => (
            <Link key={`${link.href}-${link.label}`} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
