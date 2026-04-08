import { useEffect, useState } from "react";
import type { Habit } from "./types";
import { loadHabits, saveHabits } from "./storage";
import { AddHabit } from "./components/AddHabit";
import { HabitCard } from "./components/HabitCard";
import { todayKey } from "./date";
import "./App.css";

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  function addHabit(name: string, color: string) {
    setHabits((h) => [
      ...h,
      {
        id: uid(),
        name,
        color,
        createdAt: todayKey(),
        completions: {},
      },
    ]);
  }

  function toggleDay(id: string, dateKey: string) {
    setHabits((h) =>
      h.map((habit) => {
        if (habit.id !== id) return habit;
        const next = { ...habit.completions };
        if (next[dateKey]) delete next[dateKey];
        else next[dateKey] = true;
        return { ...habit, completions: next };
      }),
    );
  }

  function deleteHabit(id: string) {
    setHabits((h) => h.filter((x) => x.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Habit Tracker</h1>
        <p className="muted">
          Build streaks. Tap any square to mark a day. Stored in your browser.
        </p>
      </header>

      <AddHabit onAdd={addHabit} />

      {habits.length === 0 ? (
        <div className="empty">
          <p>No habits yet — add one above to get started.</p>
        </div>
      ) : (
        <div className="habits">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleDay={toggleDay}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}

      <footer className="app-footer">
        <span className="muted">Less</span>
        <div className="legend">
          <span className="cell" />
          <span className="cell" style={{ background: "#0e4429" }} />
          <span className="cell" style={{ background: "#006d32" }} />
          <span className="cell" style={{ background: "#26a641" }} />
          <span className="cell" style={{ background: "#39d353" }} />
        </div>
        <span className="muted">More</span>
      </footer>
    </div>
  );
}
