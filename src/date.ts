/** Returns yyyy-mm-dd in local time. */
export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toKey(new Date());
}

export function addDays(d: Date, days: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
}

/** Returns the Monday of the week containing `d`. */
export function getMondayOf(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  // getDay(): 0=Sun,1=Mon,...,6=Sat
  const dow = c.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  c.setDate(c.getDate() + diff);
  return c;
}

/** Returns the 7 Date objects (Mon–Sun) for the week containing `today`. */
export function getCurrentWeekDays(today: Date = new Date()): Date[] {
  return getWeekDays(getMondayOf(today));
}

/** Returns the 7 Date objects (Mon–Sun) starting from `monday`. */
export function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/**
 * Returns the Mondays for the 4 weeks prior to the current week,
 * ordered oldest first.
 */
export function getPreviousWeekMondays(today: Date = new Date()): Date[] {
  const thisMonday = getMondayOf(today);
  return Array.from({ length: 4 }, (_, i) => addDays(thisMonday, -(4 - i) * 7));
}

export function computeStreak(
  completions: Record<string, true>,
  today: Date = new Date(),
): number {
  let streak = 0;
  let cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  // If today not done, the streak counts from yesterday backwards.
  if (!completions[toKey(cursor)]) {
    cursor = addDays(cursor, -1);
  }
  while (completions[toKey(cursor)]) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
