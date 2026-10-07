/**
 * @file src/charts/size.ts
 * @desc The size every kit chart takes: it fills its parent, and `width` and `height` give the
 *       first render a size before the container is measured (static export, tests). Pure,
 *       server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** The size before measurement, in px. */
export type ChartSize = { width?: number | undefined; height?: number | undefined };

/**
 * @function sizeProps
 * @param size {ChartSize} the initial width and height
 * @returns {{ initialDimension?: { width: number; height: number } }} ResponsiveContainer's
 *          initial size when both are given, nothing otherwise
 */
export const sizeProps = ({ width, height }: ChartSize) =>
  width && height ? { initialDimension: { width, height } } : {};
