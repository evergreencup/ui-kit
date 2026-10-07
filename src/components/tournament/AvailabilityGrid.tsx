/**
 * @file src/components/tournament/AvailabilityGrid.tsx
 * @desc Client availability picker: click or Enter/Space toggles an hour, a day label toggles
 *       the whole day, an hour header toggles that hour across the weekend, and a mouse drag paints
 *       a rectangle (adding or removing by the first cell). The cells are one Tab stop: arrows,
 *       Home and End move between them. Hours stay 24px wide, so a narrow screen scrolls the
 *       grid sideways. A status line under it reads the hovered hour or the count, and a
 *       screen-reader line announces the picked runs.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { cx } from "../../utils/cx.js";
import { plural } from "../../utils/format.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { labelClasses } from "../basics/labelStyles.js";
import {
  applyIds,
  DAY_LABELS,
  DAYS,
  type GridPoint,
  gridMove,
  HOURS,
  rangeIds,
  slotId,
  summarizeAvailability,
  toggleIds,
} from "./availability.js";
import {
  CELL_OFF,
  CELL_ON,
  DAY_LABEL,
  EDIT_GRID_COLUMNS,
  GRID_FRAME,
  HOUR_LABEL,
  showHourLabel,
} from "./gridStyles.js";

/** The controlled selection, its handler, and whether editing is off. */
export type AvailabilityGridProps = {
  selected: readonly string[];
  onChange: (next: string[]) => void;
  disabled?: boolean | undefined;
  /** The status line when nothing is hovered or picked. */
  emptyHint?: string | undefined;
};

type Point = GridPoint;
type Drag = Point & { mode: "add" | "remove"; base: readonly string[] };

/**
 * @function AvailabilityGrid
 * @param props {AvailabilityGridProps} selected, onChange, disabled and emptyHint
 * @returns {JSX.Element} the editable grid and its status line
 */
export const AvailabilityGrid = ({
  selected,
  onChange,
  disabled = false,
  emptyHint = "drag to paint, or click individual hours",
}: AvailabilityGridProps) => {
  const picked = new Set(selected);
  const drag = useRef<Drag | null>(null);
  const [hover, setHover] = useState<Point | null>(null);
  const [cursor, setCursor] = useState<Point>({ day: "fri", hour: 0 });
  const grid = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const end = (): void => {
      drag.current = null;
    };
    window.addEventListener("mouseup", end);
    return () => {
      window.removeEventListener("mouseup", end);
    };
  }, []);

  const press = (point: Point): void => {
    const mode = picked.has(slotId(point.day, point.hour)) ? "remove" : "add";
    drag.current = { ...point, mode, base: selected };
    onChange(applyIds(selected, [slotId(point.day, point.hour)], mode));
  };
  const enter = (point: Point): void => {
    setHover(point);
    const d = drag.current;
    if (d) onChange(applyIds(d.base, rangeIds(d, point), d.mode));
  };

  const onCellKey = (point: Point) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onChange(toggleIds(selected, [slotId(point.day, point.hour)]));
      return;
    }
    const next = gridMove(event.key, point);
    if (next === null) return;
    event.preventDefault();
    setCursor(next);
    grid.current
      ?.querySelector<HTMLButtonElement>(`[data-slot="${slotId(next.day, next.hour)}"]`)
      ?.focus();
  };

  const status = hover
    ? `${DAY_LABELS[hover.day]} · ${HOURS[hover.hour] as string}:00`
    : selected.length > 0
      ? `${plural(selected.length, "hour")} picked`
      : emptyHint;

  const button = cx("transition disabled:cursor-not-allowed disabled:opacity-60", FOCUS_RING);

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-2">
      <div ref={grid} className={cx(GRID_FRAME, "max-w-full overflow-x-auto")}>
        <div className="grid items-center gap-px" style={EDIT_GRID_COLUMNS}>
          <span />
          {HOURS.map((h, i) => (
            <button
              key={h}
              type="button"
              disabled={disabled}
              aria-label={`Toggle ${h}:00 on every day`}
              onClick={() =>
                onChange(
                  toggleIds(
                    selected,
                    DAYS.map((d) => slotId(d, i)),
                  ),
                )
              }
              className={cx(HOUR_LABEL, button, "h-6 hover:text-evergreen-200")}
            >
              {showHourLabel(i) ? h : "·"}
            </button>
          ))}
        </div>
        {DAYS.map((day) => (
          <div key={day} className="grid items-center gap-px" style={EDIT_GRID_COLUMNS}>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Toggle all of ${DAY_LABELS[day]}`}
              onClick={() =>
                onChange(
                  toggleIds(
                    selected,
                    HOURS.map((_, i) => slotId(day, i)),
                  ),
                )
              }
              className={cx(DAY_LABEL, button, "min-h-6 text-left hover:text-evergreen-50")}
            >
              {DAY_LABELS[day]}
            </button>
            {HOURS.map((h, i) => {
              const on = picked.has(slotId(day, i));
              const stop = cursor.day === day && cursor.hour === i;
              return (
                <button
                  key={h}
                  type="button"
                  disabled={disabled}
                  aria-pressed={on}
                  aria-label={`${DAY_LABELS[day]} ${h}:00`}
                  data-slot={slotId(day, i)}
                  tabIndex={stop ? 0 : -1}
                  onFocus={() => {
                    setCursor({ day, hour: i });
                  }}
                  onMouseDown={() => press({ day, hour: i })}
                  onMouseEnter={() => enter({ day, hour: i })}
                  onMouseLeave={() => setHover(null)}
                  onKeyDown={onCellKey({ day, hour: i })}
                  className={cx(
                    "h-6 rounded-[1px]",
                    button,
                    on
                      ? `${CELL_ON} hover:bg-evergreen-400`
                      : `${CELL_OFF} hover:bg-evergreen-700/60`,
                    i % 3 === 0 && "ml-px",
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {summarizeAvailability(selected)}
      </p>
      <p
        className={labelClasses({
          tone: "fog",
          className: "min-h-[1.2em] font-normal tracking-[0.18em]",
        })}
      >
        {status}
      </p>
    </div>
  );
};
