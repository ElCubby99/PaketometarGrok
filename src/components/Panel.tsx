export function Panel({
  children,
  padded = false,
  className = "",
}: {
  children: React.ReactNode;
  padded?: boolean;
  className?: string;
}) {
  const classes = ["panel", padded ? "panel--pad" : "", className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}
