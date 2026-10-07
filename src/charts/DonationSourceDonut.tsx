/**
 * @file src/charts/DonationSourceDonut.tsx
 * @desc Client Recharts donut of dollars raised per source, the total stacked in the ring's
 *       middle and a ChartLegend of donation counts below. An empty line replaces it when
 *       nothing has come in. Fills its parent (put it in a ChartCard).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { headingClasses } from "../components/basics/headingStyles.js";
import { labelClasses } from "../components/basics/labelStyles.js";
import { ChartLegend } from "../components/data/ChartTooltip.js";
import { seriesColor } from "../components/data/chartTheme.js";
import { formatUsd } from "../utils/format.js";
import { ChartDataTable } from "./ChartDataTable.js";
import { ChartEmpty } from "./ChartEmpty.js";
import {
  type DonationSourceSlice,
  DonationSourceTooltip,
  type DonutDatum,
} from "./DonationSourceTooltip.js";
import { type ChartSize, sizeProps } from "./size.js";

/** The slices, the center label and the empty line, and an optional fixed size. */
export type DonationSourceDonutProps = ChartSize & {
  slices: readonly DonationSourceSlice[];
  /** Over the total (default "Raised"). */
  label?: string | undefined;
  /** When the total is zero (default "No donations logged yet."). */
  empty?: string | undefined;
  /** The hidden data table's caption (default "Donations by source"). */
  caption?: string | undefined;
};

/**
 * @function DonationSourceDonut
 * @param props {DonationSourceDonutProps} slices, label, empty, caption and size
 * @returns {JSX.Element} the donut with its center total, legend and sr-only data table
 */
export const DonationSourceDonut = ({
  slices,
  label = "Raised",
  empty = "No donations logged yet.",
  caption = "Donations by source",
  ...size
}: DonationSourceDonutProps) => {
  const data: DonutDatum[] = slices.map((s, i) => ({
    ...s,
    value: s.usdCents,
    fill: s.color ?? seriesColor(i),
  }));
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return <ChartEmpty>{empty}</ChartEmpty>;
  return (
    <div className="relative size-full">
      <ResponsiveContainer width="100%" height="100%" {...sizeProps(size)}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="65%"
            outerRadius="95%"
            paddingAngle={2}
            stroke="var(--color-evergreen-950)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Tooltip content={<DonationSourceTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className={labelClasses({ tone: "fog", size: "xs", className: "font-normal" })}>
          {label}
        </span>
        <span className={headingClasses("md", "font-black text-2xl leading-none")}>
          {formatUsd(total)}
        </span>
      </div>
      <ChartDataTable
        caption={caption}
        columns={["Source", "Donations", "Amount"]}
        rows={data.map((d) => [d.label, d.count.toString(), formatUsd(d.value)])}
      />
      <ChartLegend
        className="absolute inset-x-0 bottom-0"
        rows={data.map((d) => ({ label: d.label, value: d.count.toString(), swatch: d.fill }))}
      />
    </div>
  );
};
