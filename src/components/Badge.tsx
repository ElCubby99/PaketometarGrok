export function Badge({
  variant,
  children,
}: {
  variant?: "unverified" | "moderated";
  children: React.ReactNode;
}) {
  const variantClass = variant ? ` badge--${variant}` : "";
  return <span className={`badge${variantClass}`}>{children}</span>;
}
