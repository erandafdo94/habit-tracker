import type { Habit } from "../types";
import { computeStreak, todayKey } from "../date";
import { ContributionGrid } from "./ContributionGrid";

type Props = {
  habit: Habit;
  onToggleDay: (id: string, dateKey: string) => void;
  onDelete: (id: string) => void;
};

export function HabitCard({ habit, onToggleDay, onDelete }: Props) {
  const today = todayKey();
  const doneToday = !!habit.completions[today];
  const streak = computeStreak(habit.completions);
  const total = Object.keys(habit.completions).length;

  return (
    <article className="habit-card">
      <header className="habit-head">
        <div className="habit-title">
          <span
            className="habit-dot"
            style={{ background: habit.color }}
            aria-hidden
          />
          <h2>{habit.name}</h2>
        </div>
        <div className="habit-actions">
          <button
            type="button"
            className={`btn-check ${doneToday ? "is-done" : ""}`}
            onClick={() => onToggleDay(habit.id, today)}
            style={doneToday ? { background: habit.color, borderColor: habit.color } : undefined}
          >
            {doneToday ? "Done today" : "Mark today"}
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={() => onDelete(habit.id)}
            aria-label={`Delete ${habit.name}`}
            title="Delete habit"
          >
            ×
          </button>
        </div>
      </header>

      <div className="habit-stats">
        <span>
          <strong>{streak}</strong> day streak
        </span>
        <span>
          <strong>{total}</strong> total
        </span>
      </div>

      <ContributionGrid
        completions={habit.completions}
        color={habit.color}
        onToggle={(dateKey) => onToggleDay(habit.id, dateKey)}
      />
    </article>
  );
}
