/**
 * @file src/components/data/ChartTooltip.tsx
 * @desc The floating chart tooltip panel and the legend row, in the card chrome instead of a
 *       library's white box. Both take plain rows. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { labelClasses } from "../basics/labelStyles.js";

/** One labeled value, with an optional color swatch. */
export type ChartRow = { label: string; value: string; swatch?: string | undefined };

const Swatch = ({ color, className }: { color: string; className: string }) => (
  <span
    aria-hidden
    className={cx("shrink-0 rounded-sm", className)}
    style={{ backgroundColor: color }}
  />
);

/**
 * @function ChartTooltip
 * @param props {{ heading: string; rows: readonly ChartRow[]; footer?: ReactNode }} the panel's
 *        heading, rows and footer
 * @returns {JSX.Element} the tooltip panel
 */
export const ChartTooltip = ({
  heading,
  rows,
  footer,
}: {
  heading: string;
  rows: readonly ChartRow[];
  footer?: ReactNode;
}) => (
  <div className="flex min-w-36 flex-col gap-2 rounded-sm border border-evergreen-700 bg-evergreen-950/95 px-3 py-2.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.75)] backdrop-blur-xs">
    <p className={labelClasses({ tone: "fog", className: "font-normal tracking-[0.22em]" })}>
      {heading}
    </p>
    <ul className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center gap-2 text-[11px]">
          {row.swatch ? <Swatch color={row.swatch} className="size-2.5" /> : null}
          <span className="flex-1 text-fog-300">{row.label}</span>
          <span className="font-mono text-evergreen-100 tracking-[0.08em]">{row.value}</span>
        </li>
      ))}
    </ul>
    {footer ? <div className="text-[10px] text-fog-500">{footer}</div> : null}
  </div>
);

/**
 * @function ChartLegend
 * @param props {{ rows: readonly ChartRow[]; className?: string }} the series and classes
 * @returns {JSX.Element} a centered wrap of "LABEL · value" entries with swatches
 */
export const ChartLegend = ({
  rows,
  className,
}: {
  rows: readonly ChartRow[];
  className?: string;
}) => (
  <ul className={cx("flex flex-wrap justify-center gap-x-4 gap-y-1", className)}>
    {rows.map((row) => (
      <li
        key={row.label}
        className={labelClasses({
          tone: "muted",
          size: "xs",
          className: "flex items-center gap-1.5 font-normal",
        })}
      >
        {row.swatch ? <Swatch color={row.swatch} className="size-2" /> : null}
        {row.label} · {row.value}
      </li>
    ))}
  </ul>
);
