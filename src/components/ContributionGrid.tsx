import { useMemo } from "react";
import {
  buildYearGrid,
  monthLabelsForGrid,
  toKey,
  todayKey,
} from "../date";

type Props = {
  completions: Record<string, true>;
  color: string;
  onToggle?: (dateKey: string) => void;
};

const CELL = 11;
const GAP = 3;

export function ContributionGrid({ completions, color, onToggle }: Props) {
  const grid = useMemo(() => buildYearGrid(), []);
  const months = useMemo(() => monthLabelsForGrid(grid), [grid]);
  const today = todayKey();

  const width = grid.length * (CELL + GAP);
  const height = 7 * (CELL + GAP);

  return (
    <div className="grid-wrap">
      <svg
        width={width}
        height={height + 16}
        role="img"
        aria-label="Contribution grid"
      >
        {months.map((m) => (
          <text
            key={`${m.col}-${m.label}`}
            x={m.col * (CELL + GAP)}
            y={10}
            className="grid-month"
          >
            {m.label}
          </text>
        ))}
        <g transform={`translate(0, 16)`}>
          {grid.map((col, ci) =>
            col.map((date, ri) => {
              if (!date) return null;
              const key = toKey(date);
              const done = !!completions[key];
              const isToday = key === today;
              const isFuture = date > new Date();
              return (
                <rect
                  key={`${ci}-${ri}`}
                  x={ci * (CELL + GAP)}
                  y={ri * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  ry={2}
                  className={`cell ${done ? "cell-done" : ""} ${
                    isToday ? "cell-today" : ""
                  }`}
                  style={done ? { fill: color } : undefined}
                  onClick={
                    onToggle && !isFuture ? () => onToggle(key) : undefined
                  }
                >
                  <title>{`${key}${done ? " — done" : ""}`}</title>
                </rect>
              );
            }),
          )}
        </g>
      </svg>
    </div>
  );
}
