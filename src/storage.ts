import type { Habit } from "./types";

const KEY = "habit-tracker:v1";

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Habit[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(KEY, JSON.stringify(habits));
}
