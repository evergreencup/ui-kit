/**
 * @file src/components/tournament/gridStyles.ts
 * @desc The availability grid's shared layout: the 2.5rem label column plus 24 hour columns,
 *       which hour headers get a label, and the cell colors.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** The grid template: a label column, then 24 equal hours. */
export const GRID_COLUMNS = { gridTemplateColumns: "2.5rem repeat(24, minmax(0, 1fr))" } as const;

/** Every third hour gets a printed header. */
export const showHourLabel = (hour: number): boolean => hour % 3 === 0;

/** A picked cell and an empty one. */
export const CELL_ON = "bg-evergreen-500";
export const CELL_OFF = "bg-evergreen-900/60";

/** The panel around the grid. */
export const GRID_FRAME =
  "select-none rounded-sm border border-evergreen-800/60 bg-evergreen-950 p-2";

/** The day label on each row. */
export const DAY_LABEL =
  "py-1 font-display font-semibold text-[11px] text-evergreen-200 uppercase tracking-[0.16em]";

/** The hour header text. */
export const HOUR_LABEL =
  "text-center font-mono text-[9px] text-fog-500 uppercase tracking-[0.12em]";
