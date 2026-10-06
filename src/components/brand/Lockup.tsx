/**
 * @file src/components/brand/Lockup.tsx
 * @desc The wordmark over a PNW arrow motif on a Pitch tile: the brand study's two lockups,
 *       for heroes, OG art and the brand page. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { panelClasses } from "../basics/panelStyles.js";
import { PnwArrows, type PnwArrowsVariant } from "./PnwArrows.js";
import { Wordmark } from "./Wordmark.js";

/** The motif behind the wordmark and the tile's classes. */
export type LockupProps = {
  variant?: PnwArrowsVariant | undefined;
  className?: string | undefined;
};

const MOTIF: Record<PnwArrowsVariant, string> = {
  chevrons: "inset-x-0 top-1/2 h-32 w-full -translate-y-1/2 text-evergreen-500/45",
  compass: "top-1/2 left-1/2 size-56 -translate-x-1/2 -translate-y-1/2 text-evergreen-500/35",
};

/**
 * @function Lockup
 * @param props {LockupProps} variant (default "chevrons") and className
 * @returns {JSX.Element} the tile with the motif behind a 1.4x wordmark
 */
export const Lockup = ({ variant = "chevrons", className }: LockupProps) => (
  <div
    className={panelClasses({
      tone: "solid",
      padding: "none",
      className: cx("relative flex h-48 items-center justify-center overflow-hidden", className),
    })}
  >
    <PnwArrows variant={variant} className={cx("absolute", MOTIF[variant])} />
    <Wordmark className="relative z-10 scale-[1.4]" />
  </div>
);
