/**
 * @file src/components/basics/headingStyles.ts
 * @desc Class builder for display headings in Big Shoulders: the hero title down to a card
 *       title, all in Mist (evergreen-50).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";

/**
 * hero 5xl to 7xl (page heroes), xl 3xl to 4xl (page sections), lg 2xl uppercase (card and rules
 * sections), md xl (sub-sections), sm lg uppercase (chart and tier cards).
 */
export type HeadingSize = "hero" | "xl" | "lg" | "md" | "sm";

const SIZES: Record<HeadingSize, string> = {
  hero: "text-5xl font-black tracking-[-0.03em] sm:text-6xl md:text-7xl",
  xl: "text-3xl font-bold tracking-[-0.02em] sm:text-4xl",
  lg: "text-2xl font-black uppercase tracking-[-0.01em]",
  md: "text-xl font-bold tracking-[-0.02em]",
  sm: "text-lg font-black uppercase tracking-[-0.01em]",
};

/**
 * @function headingClasses
 * @param size {HeadingSize} the heading's scale (default "lg")
 * @param className {string} extra classes, last
 * @returns {string} the display heading classes
 */
export const headingClasses = (size: HeadingSize = "lg", className?: string): string =>
  cx("font-display text-evergreen-50", SIZES[size], className);
