/**
 * @file src/components/brand/SprigStripe.tsx
 * @desc A strip of repeating conifer sprigs across the top edge of its positioned parent (the
 *       footer's crown). Decorative. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { SPRIG, sprigDataUri } from "../../brand/glyphs.js";
import { cx } from "../../utils/cx.js";

/**
 * @function SprigStripe
 * @param props {{ className?: string; fill?: string }} extra classes and the sprig color
 * @returns {JSX.Element} the absolutely positioned strip, aria-hidden
 */
export const SprigStripe = ({ className, fill }: { className?: string; fill?: string }) => (
  <div
    aria-hidden
    className={cx("pointer-events-none absolute inset-x-0 top-0 h-3 opacity-30", className)}
    style={{
      backgroundImage: sprigDataUri(fill),
      backgroundRepeat: "repeat-x",
      backgroundSize: `${SPRIG.width.toString()}px ${SPRIG.height.toString()}px`,
    }}
  />
);
