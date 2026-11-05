import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/">
      <span className="brand__mark" aria-hidden="true" />
      Paketometar
    </Link>
  );
}
