import { useEffect, useState } from "react";
import type { Habit } from "./types";
import { loadHabits, saveHabits } from "./storage";
import { AddHabit } from "./components/AddHabit";
import {
  toKey,
  todayKey,
  getMondayOf,
  getWeekDays,
  addDays,
  computeStreak,
} from "./date";
import "./App.css";

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function weekRangeLabel(days: Date[]): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(days[0])} – ${fmt(days[6])}`;
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonday = getMondayOf(today);
  const viewMonday = addDays(thisMonday, weekOffset * 7);
  const weekDays = getWeekDays(viewMonday);
  const todayStr = todayKey();
  const isCurrentWeek = weekOffset === 0;

  function addHabit(name: string, color: string) {
    setHabits((h) => [
      ...h,
      { id: uid(), name, color, createdAt: todayStr, completions: {} },
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
        <h1>habit tracker</h1>
      </header>

      <AddHabit onAdd={addHabit} />

      <div className="week-nav">
        <button className="nav-btn" onClick={() => setWeekOffset((o) => o - 1)}>
          ←
        </button>
        <span className="week-title">
          {isCurrentWeek ? "this week" : weekRangeLabel(weekDays)}
        </span>
        <button
          className="nav-btn"
          onClick={() => setWeekOffset((o) => o + 1)}
          disabled={isCurrentWeek}
        >
          →
        </button>
      </div>

      {habits.length === 0 ? (
        <p className="empty">no habits yet — add one above.</p>
      ) : (
        <table className="habit-table">
          <thead>
            <tr>
              <th className="col-habit" />
              {weekDays.map((d, i) => {
                const key = toKey(d);
                const isToday = key === todayStr;
                return (
                  <th key={key} className={"col-day" + (isToday ? " col-today" : "")}>
                    {DAY_LABELS[i]}
                  </th>
                );
              })}
              <th className="col-streak">streak</th>
              <th className="col-del" />
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const streak = computeStreak(habit.completions);
              return (
                <tr key={habit.id}>
                  <td className="cell-name">
                    <span className="habit-dot" style={{ background: habit.color }} />
                    {habit.name}
                  </td>
                  {weekDays.map((d) => {
                    const key = toKey(d);
                    const done = !!habit.completions[key];
                    const isFuture = d > today;
                    const isToday = key === todayStr;
                    return (
                      <td
                        key={key}
                        className={"cell-day" + (isToday ? " cell-today" : "") + (isFuture ? " cell-future" : "")}
                      >
                        <input
                          type="checkbox"
                          checked={done}
                          disabled={isFuture}
                          onChange={() => !isFuture && toggleDay(habit.id, key)}
                          style={done ? { accentColor: habit.color } : undefined}
                        />
                      </td>
                    );
                  })}
                  <td className="cell-streak">{streak}</td>
                  <td className="cell-del">
                    <button
                      className="btn-del"
                      onClick={() => deleteHabit(habit.id)}
                      title="delete"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <footer className="app-footer">
        data is stored in your browser — clearing cache will erase all history.
      </footer>
    </div>
  );
}
