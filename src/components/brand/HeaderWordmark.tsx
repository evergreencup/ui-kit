/**
 * @file src/components/brand/HeaderWordmark.tsx
 * @desc The header lockup: "EGC" at rest; hovering the wrapping link (which needs the
 *       `group` class) rolls the text up out of a clipped box while the conifer rolls up into its
 *       place. Pure CSS; it snaps under reduced motion. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { BRAND } from "../../brand/identity.js";
import { ConiferGlyph } from "./ConiferGlyph.js";
import { WORDMARK_TEXT } from "./wordmarkStyles.js";

const ROLL = "transition-transform duration-300 ease-out motion-reduce:transition-none";

/**
 * @function HeaderWordmark
 * @returns {JSX.Element} the animated lockup; put it inside a link with the `group` class
 */
export const HeaderWordmark = () => (
  <span className="relative flex h-8 w-[3.6rem] items-center justify-center overflow-hidden text-evergreen-50">
    <span
      className={`absolute inset-0 flex items-center justify-center whitespace-nowrap group-hover:-translate-y-full ${WORDMARK_TEXT} ${ROLL}`}
    >
      {BRAND.short}
    </span>
    <span
      aria-hidden
      className={`absolute inset-0 flex translate-y-full items-center justify-center group-hover:translate-y-0 ${ROLL}`}
    >
      <ConiferGlyph />
    </span>
  </span>
);
