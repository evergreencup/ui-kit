/**
 * @file src/components/brand/ConiferGlyph.tsx
 * @desc The conifer mark: an evergreen-400 crown on a bark-500 trunk, drawn from the shared
 *       glyph data. Decorative. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { CONIFER_PATH, CONIFER_TRUNK } from "../../brand/glyphs.js";
import { cx } from "../../utils/cx.js";

/** Native svg props, plus the trunk's class (its color). */
export type ConiferGlyphProps = Omit<ComponentProps<"svg">, "children"> & {
  trunkClassName?: string | undefined;
};

/**
 * @function ConiferGlyph
 * @param props {ConiferGlyphProps} className (size and crown color, default size-6
 *        text-evergreen-400), trunkClassName (default text-bark-500) and svg props
 * @returns {JSX.Element} the 32x32 conifer, aria-hidden
 */
export const ConiferGlyph = ({ className, trunkClassName, ...props }: ConiferGlyphProps) => (
  <svg
    viewBox="0 0 32 32"
    aria-hidden
    fill="currentColor"
    className={cx("size-6 shrink-0 text-evergreen-400", className)}
    {...props}
  >
    <path d={CONIFER_PATH} />
    <rect {...CONIFER_TRUNK} className={cx("text-bark-500", trunkClassName)} fill="currentColor" />
  </svg>
);
