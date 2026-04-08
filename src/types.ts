export type Habit = {
  id: string;
  name: string;
  color: string;
  createdAt: string; // ISO date (yyyy-mm-dd)
  /** Map of yyyy-mm-dd -> true when completed on that day */
  completions: Record<string, true>;
};
