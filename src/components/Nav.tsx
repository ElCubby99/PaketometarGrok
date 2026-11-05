"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Naslovnica", current: (path: string) => path === "/" },
  { href: "/map", label: "Karta", current: (path: string) => path.startsWith("/map") },
  { href: "/report", label: "Prijava", current: (path: string) => path.startsWith("/report") },
  {
    href: "/carriers/gls",
    label: "Prijevoznici",
    current: (path: string) => path.startsWith("/carriers"),
  },
  {
    href: "/escalations",
    label: "Eskalacija",
    current: (path: string) => path.startsWith("/escalations"),
  },
  { href: "/about", label: "O projektu", current: (path: string) => path.startsWith("/about") },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Glavna navigacija">
      {items.map((item) => {
        const active = item.current(pathname);
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
