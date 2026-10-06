/**
 * @file src/components/basics/ProgressBar.tsx
 * @desc A rounded evergreen meter on a recessed track, as a labeled progressbar. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { percentOf } from "../../utils/format.js";

/** The meter's value, its maximum, its accessible name and extra classes. */
export type ProgressBarProps = {
  value: number;
  max?: number | undefined;
  label: string;
  className?: string | undefined;
};

/**
 * @function ProgressBar
 * @param props {ProgressBarProps} value, max (default 100), label and className
 * @returns {JSX.Element} the track with its fill, clamped to 0 to 100%
 */
export const ProgressBar = ({ value, max = 100, label, className }: ProgressBarProps) => {
  const pct = percentOf(value, max);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cx(
        "relative h-3 w-full overflow-hidden rounded-full border border-evergreen-800/60 bg-evergreen-900/60",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-evergreen-500 transition-[width] duration-500 forced-colors:bg-[Highlight]"
        style={{ width: `${pct.toString()}%` }}
      />
    </div>
  );
};
