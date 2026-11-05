export function ChoiceCard({
  title,
  hint,
  selected,
  onSelect,
}: {
  title: string;
  hint: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`choice-card${selected ? " is-selected" : ""}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="choice-card__title">{title}</span>
      <span className="meta">{hint}</span>
    </button>
  );
}
