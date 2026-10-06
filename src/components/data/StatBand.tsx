/**
 * @file src/components/data/StatBand.tsx
 * @desc A band of headline cells ("Right now", "Progress", "LAN countdown") split by hairlines:
 *       one column on phones, one per cell from sm. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";

/** One cell: a small label over a display value. */
export type StatBandItem = { label: string; value: ReactNode };

/**
 * @function StatBand
 * @param props {{ items: readonly StatBandItem[]; className?: string }} the cells and classes
 * @returns {JSX.Element} a definition list laid out as a band
 */
export const StatBand = ({
  items,
  className,
}: {
  items: readonly StatBandItem[];
  className?: string;
}) => (
  <dl
    className={cx(
      "grid grid-cols-1 gap-px overflow-hidden rounded-md border border-evergreen-700/60 bg-evergreen-700/40 sm:auto-cols-fr sm:grid-flow-col",
      className,
    )}
  >
    {items.map((item) => (
      <div key={item.label} className="flex flex-col gap-1 bg-evergreen-950/90 px-5 py-4">
        <dt className="font-semibold text-[10px] text-fog-300 uppercase tracking-[0.22em]">
          {item.label}
        </dt>
        <dd className="font-black font-display text-evergreen-50 text-lg uppercase tracking-[0.01em]">
          {item.value}
        </dd>
      </div>
    ))}
  </dl>
);
