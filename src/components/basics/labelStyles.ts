/**
 * @file src/components/basics/labelStyles.ts
 * @desc Class builder for the mono, uppercase, wide-tracked labels the cup uses for eyebrows,
 *       stat labels, table headers and status lines.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";

/** The label's color. */
export type LabelTone = "moss" | "fog" | "evergreen" | "cascade" | "bark" | "muted";

/** xs 9px for stat captions, sm 10px for eyebrows and table heads, md 11px for status lines. */
export type LabelSize = "xs" | "sm" | "md";

/** Options for {@link labelClasses}. */
export type LabelClassOptions = {
  tone?: LabelTone | undefined;
  size?: LabelSize | undefined;
  className?: string | undefined;
};

/** Text color per label tone. */
export const LABEL_TONES: Record<LabelTone, string> = {
  moss: "text-moss-400",
  fog: "text-fog-500",
  evergreen: "text-evergreen-300",
  cascade: "text-cascade-300",
  bark: "text-bark-300",
  muted: "text-fog-400",
};

const SIZES: Record<LabelSize, string> = {
  xs: "text-[9px] tracking-[0.22em]",
  sm: "text-[10px] tracking-[0.28em]",
  md: "text-[11px] tracking-[0.18em]",
};

/**
 * @function labelClasses
 * @param opts {LabelClassOptions} tone (default "moss"), size (default "sm") and extra classes
 * @returns {string} mono uppercase label classes with the caller's className last
 */
export const labelClasses = ({ tone = "moss", size = "sm", className }: LabelClassOptions = {}) =>
  cx("font-mono font-semibold uppercase", LABEL_TONES[tone], SIZES[size], className);
