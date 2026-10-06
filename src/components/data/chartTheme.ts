/**
 * @file src/components/data/chartTheme.ts
 * @desc Chart styling as plain values for any SVG chart library (Recharts, visx): the series
 *       palette, the axis tick and grid props, and the cursor. No chart dependency here; an app
 *       spreads these into its own chart components.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** The series colors in order: evergreen, cascade, moss, bark, fog. */
export const SERIES_COLORS = [
  "var(--color-evergreen-400)",
  "var(--color-cascade-400)",
  "var(--color-moss-400)",
  "var(--color-bark-400)",
  "var(--color-fog-500)",
] as const;

/**
 * @function seriesColor
 * @param index {number} the series' position
 * @returns {string} its color, cycling through SERIES_COLORS
 */
export const seriesColor = (index: number): string =>
  SERIES_COLORS[
    ((index % SERIES_COLORS.length) + SERIES_COLORS.length) % SERIES_COLORS.length
  ] as string;

/** Axis tick text: small fog mono. */
export const AXIS_TICK = {
  fill: "var(--color-fog-500)",
  fontSize: 10,
  fontFamily: "var(--font-mono)",
  letterSpacing: "0.1em",
} as const;

/** A category axis in the display face (e.g. "PLAYER", "STAFF"). */
export const CATEGORY_TICK = {
  fill: "var(--color-evergreen-200)",
  fontSize: 10,
  fontFamily: "var(--font-display)",
  letterSpacing: "0.2em",
} as const;

/** Axis props: no tick lines, no axis line. */
export const AXIS = { stroke: "var(--color-fog-500)", tickLine: false, axisLine: false } as const;

/** Grid lines: faint evergreen-800. */
export const GRID = { stroke: "var(--color-evergreen-800)", strokeOpacity: 0.35 } as const;

/** The hover cursor: a dashed line for line charts, a faint band for bars. */
export const CURSOR = {
  line: { stroke: "var(--color-evergreen-600)", strokeDasharray: "3 3" },
  band: { fill: "var(--color-evergreen-900)", fillOpacity: 0.4 },
} as const;
