/**
 * @file src/charts/DonationSourceTooltip.tsx
 * @desc The donation-source donut's tooltip: the source, its dollars and its donation count.
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { ChartTooltip } from "../components/data/ChartTooltip.js";
import { formatUsd } from "../utils/format.js";
import { activePoint, type TooltipContent } from "./tooltipPayload.js";

/** One source of donations (Ko-fi, manual) and what it brought in. */
export type DonationSourceSlice = {
  label: string;
  usdCents: number;
  count: number;
  /** The slice's color (default the series palette in order). */
  color?: string | undefined;
};

/** A slice with its color settled, as the donut draws it. */
export type DonutDatum = DonationSourceSlice & { fill: string; value: number };

/**
 * @function DonationSourceTooltip
 * @param props {TooltipContent<DonutDatum>} Recharts' tooltip props
 * @returns {JSX.Element | null} the panel, or null while idle
 */
export const DonationSourceTooltip = (props: TooltipContent<DonutDatum>) => {
  const slice = activePoint(props);
  if (!slice) return null;
  return (
    <ChartTooltip
      heading={slice.label}
      rows={[
        { label: "USD raised", value: formatUsd(slice.usdCents), swatch: slice.fill },
        { label: "Donations", value: slice.count.toString() },
      ]}
    />
  );
};
