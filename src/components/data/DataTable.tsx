/**
 * @file src/components/data/DataTable.tsx
 * @desc A bordered data table from column definitions and string rows: mono uppercase heads,
 *       hairline row rules, mono numeric columns, and a caption (visually hidden by default).
 *       Cells wrap instead of scrolling sideways. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { labelClasses } from "../basics/labelStyles.js";
import { panelClasses } from "../basics/panelStyles.js";

/** A column: its header and whether its cells are numbers (mono, evergreen). */
export type DataColumn = { label: string; mono?: boolean | undefined };

/** The table's caption, columns and rows. */
export type DataTableProps = {
  caption: string;
  columns: readonly DataColumn[];
  rows: readonly (readonly ReactNode[])[];
  /** Show the caption above the table (default false: screen readers only). */
  showCaption?: boolean | undefined;
  className?: string | undefined;
};

const CELL = "px-2.5 py-2.5 sm:px-4";

/**
 * @function DataTable
 * @param props {DataTableProps} caption, columns, rows, showCaption and className
 * @returns {JSX.Element} the table in a panel
 */
export const DataTable = ({
  caption,
  columns,
  rows,
  showCaption = false,
  className,
}: DataTableProps) => (
  <div className={panelClasses({ padding: "none", className })}>
    <table className="w-full border-collapse text-left">
      <caption
        className={showCaption ? cx(CELL, "text-left", labelClasses({ tone: "moss" })) : "sr-only"}
      >
        {caption}
      </caption>
      <thead>
        <tr className="border-evergreen-800/60 border-b">
          {columns.map((c) => (
            <th
              key={c.label}
              scope="col"
              className={cx(CELL, labelClasses({ tone: "fog", className: "tracking-[0.24em]" }))}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional data
          <tr key={r} className="border-evergreen-800/30 border-b last:border-b-0">
            {row.map((cell, i) => (
              <td
                // biome-ignore lint/suspicious/noArrayIndexKey: a cell's place is its identity
                key={i}
                className={cx(
                  CELL,
                  columns[i]?.mono
                    ? "font-mono font-semibold text-evergreen-200 text-xs"
                    : "text-fog-100 text-sm",
                )}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
