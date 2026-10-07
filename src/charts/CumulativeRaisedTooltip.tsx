/**
 * @file src/charts/CumulativeRaisedTooltip.tsx
 * @desc The cumulative-raised chart's tooltip: the day, what came in that day, the running
 *       total and the donation count, in the kit's ChartTooltip. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { ChartTooltip } from "../components/data/ChartTooltip.js";
import { formatShortDate, formatUsd } from "../utils/format.js";
import { activePoint, type TooltipContent } from "./tooltipPayload.js";

/** One day on the chart: its ISO date, that day's take, the running total and the count. */
export type CumulativeRaisedPoint = {
  day: string;
  usdCents: number;
  cumulativeUsdCents: number;
  count: number;
};

/** The daily bar and cumulative area colors. */
export const RAISED_COLORS = {
  daily: "var(--color-moss-400)",
  cumulative: "var(--color-evergreen-400)",
} as const;

/**
 * @function CumulativeRaisedTooltip
 * @param props {TooltipContent<CumulativeRaisedPoint>} Recharts' tooltip props
 * @returns {JSX.Element | null} the panel, or null while idle
 */
export const CumulativeRaisedTooltip = (props: TooltipContent<CumulativeRaisedPoint>) => {
  const point = activePoint(props);
  if (!point) return null;
  return (
    <ChartTooltip
      heading={formatShortDate(point.day)}
      rows={[
        { label: "Raised that day", value: formatUsd(point.usdCents), swatch: RAISED_COLORS.daily },
        {
          label: "Cumulative",
          value: formatUsd(point.cumulativeUsdCents),
          swatch: RAISED_COLORS.cumulative,
        },
        { label: "Donations", value: point.count.toString() },
      ]}
    />
  );
};
