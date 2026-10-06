/**
 * @file src/components/basics/buttonStyles.ts
 * @desc Class builder for Button and ButtonLink: the cup's square-cornered, uppercase buttons
 *       (solid evergreen, outlined, ghost and icon squares) and the rounded pill variant the mobile
 *       menu uses.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { FOCUS_RING } from "./focusStyles.js";

/**
 * `primary` solid evergreen-500 with a lift on hover, `outline` an evergreen-700 edge, `ghost`
 * text only, `icon` a bordered square for one glyph, `osu` osu!'s pink for "Sign in with osu!".
 */
export type ButtonVariant = "primary" | "outline" | "ghost" | "icon" | "osu";

/** sm compact (copy chips), md the default, lg the hero call to action. */
export type ButtonSize = "sm" | "md" | "lg";

/** Options for {@link buttonClasses}. */
export type ButtonClassOptions = {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  /** Fully rounded instead of the brand's 2px corners. */
  pill?: boolean | undefined;
  className?: string | undefined;
};

const BASE = `inline-flex items-center justify-center gap-2 font-bold uppercase transition disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`;

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-evergreen-500 text-evergreen-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_32px_-14px_rgba(0,0,0,0.6)] not-disabled:hover:-translate-y-0.5 not-disabled:hover:bg-evergreen-400 motion-reduce:not-disabled:hover:translate-y-0",
  outline:
    "border border-evergreen-700 bg-transparent text-evergreen-200 not-disabled:hover:border-evergreen-400 not-disabled:hover:text-evergreen-50",
  ghost: "text-fog-300 not-disabled:hover:bg-evergreen-900 not-disabled:hover:text-evergreen-50",
  osu: "bg-pink-500 text-white not-disabled:hover:bg-pink-600",
  icon: "size-9 border border-evergreen-800 bg-transparent p-0 text-fog-300 not-disabled:hover:border-evergreen-500 not-disabled:hover:text-evergreen-50 coarse:size-11",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-2.5 py-1 font-mono text-[10px] tracking-[0.2em]",
  md: "px-5 py-2.5 text-xs tracking-[0.16em] coarse:py-3",
  lg: "px-6 py-3 text-sm tracking-[0.16em]",
};

/**
 * @function buttonClasses
 * @param opts {ButtonClassOptions} variant (default "primary"), size (default "md", ignored by
 *        "icon"), pill and extra classes
 * @returns {string} the button classes with the caller's className last
 */
export const buttonClasses = ({
  variant = "primary",
  size = "md",
  pill = false,
  className,
}: ButtonClassOptions = {}): string =>
  cx(
    BASE,
    variant !== "icon" && SIZES[size],
    VARIANTS[variant],
    pill ? "rounded-full" : "rounded-sm",
    className,
  );
