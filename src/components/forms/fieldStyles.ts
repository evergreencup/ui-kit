/**
 * @file src/components/forms/fieldStyles.ts
 * @desc Class builders for form controls and their labels: the boxed control (bordered Pitch
 *       well) and the inline control (underline only, for flat admin sheets); the display label
 *       and the mono label.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";

/** boxed: bordered well (public forms). inline: underline only (admin sheets). */
export type FieldVariant = "boxed" | "inline";

const CONTROL: Record<FieldVariant, string> = {
  boxed:
    "w-full rounded-sm border border-evergreen-800 bg-evergreen-950/60 px-3 py-2.5 text-sm focus:border-evergreen-400 focus:ring-2 focus:ring-evergreen-400/60 coarse:py-3",
  inline:
    "w-full rounded-none border-0 border-evergreen-800/70 border-b bg-transparent px-0 py-1.5 text-base focus:border-evergreen-400",
};

/** The edge an invalid control gets, in either variant. */
export const INVALID = "border-red-400/70 focus:border-red-400";

/**
 * @function fieldClasses
 * @param variant {FieldVariant} the control style (default "boxed")
 * @param invalid {boolean} whether the control holds an error
 * @param className {string} extra classes, last
 * @returns {string} the control classes
 */
export const fieldClasses = (
  variant: FieldVariant = "boxed",
  invalid = false,
  className?: string,
) =>
  cx(
    "text-evergreen-50 transition placeholder:text-fog-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
    CONTROL[variant],
    invalid && INVALID,
    className,
  );

/** display: Big Shoulders caps (public forms). mono: the small mono label (admin sheets). */
export type FieldLabelStyle = "display" | "mono";

/** The label classes per style. */
export const FIELD_LABEL: Record<FieldLabelStyle, string> = {
  display: "font-bold font-display text-base text-evergreen-200 uppercase tracking-[0.14em]",
  mono: "font-mono font-semibold text-[10px] text-evergreen-300 uppercase tracking-[0.28em]",
};

/** Hint text under a control. */
export const FIELD_HINT = "text-[11px] text-fog-500";

/** Error text under a control. */
export const FIELD_ERROR = "text-[11px] text-red-400";
