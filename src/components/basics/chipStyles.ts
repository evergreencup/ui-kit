/**
 * @file src/components/basics/chipStyles.ts
 * @desc Class builder for toggle chips: the multi-select role, skillset and region chips and
 *       filter chips. Evergreen by default, cascade for the "other" choice.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { FOCUS_RING } from "./focusStyles.js";

/** The chip's accent. */
export type ChipTone = "evergreen" | "cascade";

const ON: Record<ChipTone, string> = {
  evergreen: "border-evergreen-400 bg-evergreen-500/20 text-evergreen-50",
  cascade: "border-cascade-400 bg-cascade-500/20 text-cascade-50",
};

const OFF: Record<ChipTone, string> = {
  evergreen:
    "border-evergreen-800/70 bg-evergreen-950/40 text-fog-300 not-disabled:hover:border-evergreen-500/60 not-disabled:hover:text-evergreen-100",
  cascade:
    "border-cascade-600/70 bg-evergreen-950/40 text-cascade-200 not-disabled:hover:border-cascade-400 not-disabled:hover:text-cascade-50",
};

/**
 * @function chipClasses
 * @param active {boolean} whether the chip is selected
 * @param tone {ChipTone} the accent (default "evergreen")
 * @param className {string} extra classes, last
 * @returns {string} the chip classes
 */
export const chipClasses = (active: boolean, tone: ChipTone = "evergreen", className?: string) =>
  cx(
    "rounded-sm border px-3 coarse:py-3 py-2 text-left font-display font-semibold text-[11px] uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-60",
    FOCUS_RING,
    active ? ON[tone] : OFF[tone],
    className,
  );
