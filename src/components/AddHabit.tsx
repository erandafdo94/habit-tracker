import { useState } from "react";

type Props = {
  onAdd: (name: string, color: string) => void;
};

const PALETTE = [
  "#2ea043",
  "#3fb950",
  "#58a6ff",
  "#bc8cff",
  "#f778ba",
  "#ff7b72",
  "#d29922",
];

export function AddHabit({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PALETTE[0]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, color);
    setName("");
  }

  return (
    <form className="add-habit" onSubmit={submit}>
      <input
        type="text"
        placeholder="New habit (e.g. Read 20 minutes)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={60}
        aria-label="Habit name"
      />
      <div className="palette" role="radiogroup" aria-label="Habit color">
        {PALETTE.map((c) => (
          <button
            type="button"
            key={c}
            className={`swatch ${color === c ? "is-active" : ""}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={`Color ${c}`}
            aria-checked={color === c}
            role="radio"
          />
        ))}
      </div>
      <button type="submit" className="btn-primary" disabled={!name.trim()}>
        Add
      </button>
    </form>
  );
}
