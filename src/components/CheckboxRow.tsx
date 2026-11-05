export function CheckboxRow({
  id,
  name,
  checked,
  onChange,
  title,
  hint,
  plain = false,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  hint: string;
  plain?: boolean;
}) {
  return (
    <div className={`checkbox-row${plain ? " checkbox-row--plain" : ""}`}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id}>
        <span className="checkbox-row__title">{title}</span>
        <span className="form-hint">{hint}</span>
      </label>
    </div>
  );
}
