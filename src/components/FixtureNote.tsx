export function FixtureNote({ children }: { children?: React.ReactNode }) {
  return (
    <p className="meta fixture-note">
      {children ?? "Sintetički uzorak za sučelje v1 — nisu stvarna opažanja."}
    </p>
  );
}
