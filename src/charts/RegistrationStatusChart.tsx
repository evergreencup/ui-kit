/**
 * @file src/charts/RegistrationStatusChart.tsx
 * @desc Client Recharts horizontal stacked bars: registrations per kind (player, staff) split
 *       by status. An empty line replaces it when there are none. Fills its parent (put it in a
 *       ChartCard).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AXIS, AXIS_TICK, CATEGORY_TICK, CURSOR, GRID } from "../components/data/chartTheme.js";
import { ChartEmpty } from "./ChartEmpty.js";
import { RegistrationStatusTooltip } from "./RegistrationStatusTooltip.js";
import { type ChartSize, sizeProps } from "./size.js";

/** The statuses the chart stacks, in order, with their labels and colors. */
export const REGISTRATION_STATUSES = [
  { key: "approved", label: "Approved", color: "var(--color-evergreen-500)" },
  { key: "pending", label: "Pending", color: "var(--color-moss-400)" },
  { key: "waitlisted", label: "Waitlisted", color: "var(--color-cascade-400)" },
  { key: "rejected", label: "Rejected", color: "var(--color-bark-400)" },
  { key: "withdrawn", label: "Withdrawn", color: "var(--color-fog-500)" },
] as const;

/** A registration status the chart stacks. */
export type RegistrationStatusKey = (typeof REGISTRATION_STATUSES)[number]["key"];

/** One bar: the kind of registration and its count per status. */
export type RegistrationStatusRow = { kind: string } & Record<RegistrationStatusKey, number>;

/** The bars, the empty line, and an optional fixed size. */
export type RegistrationStatusChartProps = ChartSize & {
  rows: readonly RegistrationStatusRow[];
  /** When every count is zero (default "No registrations yet."). */
  empty?: string | undefined;
};

/**
 * @function RegistrationStatusChart
 * @param props {RegistrationStatusChartProps} rows, empty and size
 * @returns {JSX.Element} the stacked bar chart
 */
export const RegistrationStatusChart = ({
  rows,
  empty = "No registrations yet.",
  ...size
}: RegistrationStatusChartProps) => {
  const total = rows.reduce(
    (sum, r) => sum + REGISTRATION_STATUSES.reduce((n, s) => n + r[s.key], 0),
    0,
  );
  if (total === 0) return <ChartEmpty>{empty}</ChartEmpty>;
  return (
    <ResponsiveContainer width="100%" height="100%" {...sizeProps(size)}>
      <BarChart
        data={[...rows]}
        layout="vertical"
        margin={{ top: 10, right: 8, left: 4, bottom: 4 }}
        barCategoryGap={28}
      >
        <CartesianGrid {...GRID} strokeOpacity={0.3} horizontal={false} />
        <XAxis type="number" {...AXIS} tick={AXIS_TICK} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="kind"
          {...AXIS}
          width={64}
          tick={CATEGORY_TICK}
          tickFormatter={(v: string) => v.toUpperCase()}
        />
        <Tooltip cursor={CURSOR.band} content={<RegistrationStatusTooltip />} />
        {REGISTRATION_STATUSES.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stackId="status"
            fill={s.color}
            radius={[2, 2, 2, 2]}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
