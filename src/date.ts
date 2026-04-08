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

/**
 * Build a 53 x 7 grid of dates ending on today (Saturday-anchored, like GitHub).
 * Returns columns of 7 dates from Sun..Sat. The final column may have nulls
 * for days after today.
 */
export function buildYearGrid(today: Date = new Date()): (Date | null)[][] {
  // GitHub starts weeks on Sunday. Find the Sunday at or before (today - 52 weeks).
  const end = new Date(today);
  end.setHours(0, 0, 0, 0);

  // Sunday of this week (start)
  const endSunday = addDays(end, -end.getDay());
  // Start sunday is 52 weeks before endSunday => 53 columns total
  const startSunday = addDays(endSunday, -52 * 7);

  const cols: (Date | null)[][] = [];
  for (let w = 0; w < 53; w++) {
    const col: (Date | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(startSunday, w * 7 + d);
      if (date > end) col.push(null);
      else col.push(date);
    }
    cols.push(col);
  }
  return cols;
}

export function monthLabelsForGrid(grid: (Date | null)[][]): {
  col: number;
  label: string;
}[] {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const out: { col: number; label: string }[] = [];
  let lastMonth = -1;
  grid.forEach((col, i) => {
    // First non-null day of the column
    const first = col.find((d): d is Date => d !== null);
    if (!first) return;
    if (first.getMonth() !== lastMonth && first.getDate() <= 7) {
      out.push({ col: i, label: months[first.getMonth()] });
      lastMonth = first.getMonth();
    }
  });
  return out;
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
