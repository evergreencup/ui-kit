/**
 * @file src/charts/ChartDataTable.tsx
 * @desc The text alternative every kit chart carries: its numbers as a visually hidden table, so
 *       a screen reader gets what the picture shows. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

/** The caption, the column headers, and one row per point (its first cell names the row). */
export type ChartDataTableProps = {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
};

/**
 * @function ChartDataTable
 * @param props {ChartDataTableProps} caption, columns and rows
 * @returns {JSX.Element} the table in a visually hidden wrapper
 */
export const ChartDataTable = ({ caption, columns, rows }: ChartDataTableProps) => (
  // A table ignores sr-only's 1px width and widens the page, so the wrapper carries it.
  <div className="sr-only">
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([head, ...cells]) => (
          <tr key={head}>
            <th scope="row">{head}</th>
            {cells.map((cell, i) => (
              <td key={columns[i + 1]}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
