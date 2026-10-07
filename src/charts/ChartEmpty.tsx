/**
 * @file src/charts/ChartEmpty.tsx
 * @desc The muted, centered line a chart shows in place of itself when it has no data.
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";

/**
 * @function ChartEmpty
 * @param props {{ children: ReactNode }} the line
 * @returns {JSX.Element} the empty state, filling the chart's box
 */
export const ChartEmpty = ({ children }: { children: ReactNode }) => (
  <p className="flex h-full items-center justify-center text-fog-500 text-sm italic">{children}</p>
);
