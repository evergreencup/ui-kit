/**
 * @file src/charts/CumulativeRaisedChart.tsx
 * @desc Client Recharts chart of USD raised over time: a filled area for the running total and
 *       faint bars for each day's take, the y-axis reaching past the goal. Fills its parent
 *       (put it in a ChartCard).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { useId } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS, AXIS_TICK, CURSOR, GRID } from "../components/data/chartTheme.js";
import { formatShortDate, formatUsd } from "../utils/format.js";
import {
  type CumulativeRaisedPoint,
  CumulativeRaisedTooltip,
  RAISED_COLORS,
} from "./CumulativeRaisedTooltip.js";
import { type ChartSize, sizeProps } from "./size.js";

/** The days, the goal, and an optional fixed size. */
export type CumulativeRaisedChartProps = ChartSize & {
  data: readonly CumulativeRaisedPoint[];
  goalUsdCents?: number | null | undefined;
};

/**
 * @function raisedDomainMax
 * @param data {readonly CumulativeRaisedPoint[]} the days
 * @param goalUsdCents {number | null} the goal
 * @returns {number} the y-axis top in dollars: 10% over the larger of the total and the goal
 */
export const raisedDomainMax = (
  data: readonly CumulativeRaisedPoint[],
  goalUsdCents: number | null = null,
): number =>
  Math.ceil(
    Math.max(...data.map((d) => d.cumulativeUsdCents / 100), (goalUsdCents ?? 0) / 100, 1) * 1.1,
  );

/**
 * @function CumulativeRaisedChart
 * @param props {CumulativeRaisedChartProps} data, goalUsdCents and size
 * @returns {JSX.Element} the responsive composed chart
 */
export const CumulativeRaisedChart = ({
  data,
  goalUsdCents = null,
  ...size
}: CumulativeRaisedChartProps) => {
  const gradient = `egc-raised-${useId().replace(/[^\w-]/g, "")}`;
  const rows = data.map((d) => ({
    ...d,
    dailyUsd: d.usdCents / 100,
    cumulativeUsd: d.cumulativeUsdCents / 100,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%" {...sizeProps(size)}>
      <ComposedChart data={rows} margin={{ top: 10, right: 12, left: 4, bottom: 4 }}>
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-evergreen-400)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--color-evergreen-500)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...GRID} vertical={false} />
        <XAxis
          dataKey="day"
          {...AXIS}
          tick={AXIS_TICK}
          tickFormatter={formatShortDate}
          minTickGap={32}
        />
        <YAxis
          {...AXIS}
          tick={AXIS_TICK}
          tickFormatter={(v: number) => formatUsd(v * 100)}
          domain={[0, raisedDomainMax(data, goalUsdCents)]}
          width={54}
        />
        <Tooltip cursor={CURSOR.line} content={<CumulativeRaisedTooltip />} />
        <Bar
          dataKey="dailyUsd"
          fill={RAISED_COLORS.daily}
          fillOpacity={0.35}
          barSize={6}
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="cumulativeUsd"
          stroke="var(--color-evergreen-300)"
          strokeWidth={2}
          fill={`url(#${gradient})`}
          isAnimationActive={false}
          activeDot={{ r: 4, stroke: "var(--color-evergreen-200)", strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
