/**
 * @file src/charts/tooltipPayload.ts
 * @desc The slice of Recharts' tooltip content props the kit's tooltips read, so they can be
 *       rendered (and tested) without a chart. Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** One series entry Recharts hands a tooltip. */
export type TooltipEntry<T> = {
  payload?: T | undefined;
  value?: unknown;
  name?: unknown;
  color?: string | undefined;
};

/** What Recharts passes a custom tooltip `content`. */
export type TooltipContent<T> = {
  active?: boolean | undefined;
  payload?: readonly TooltipEntry<T>[] | undefined;
  label?: unknown;
};

/**
 * @function activePoint
 * @param props {TooltipContent<T>} the tooltip props
 * @returns {T | null} the hovered datum, or null when the tooltip is idle
 */
export const activePoint = <T>({ active, payload }: TooltipContent<T>): T | null =>
  (active && payload?.[0]?.payload) || null;
