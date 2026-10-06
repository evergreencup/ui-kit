/**
 * @file src/components/brand/TokenRow.tsx
 * @desc A semantic token as a row: a color chip beside its usage, hex and token name.
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { BrandColor } from "../../brand/palette.js";
import { panelClasses } from "../basics/panelStyles.js";

/**
 * @function TokenRow
 * @param props {{ color: BrandColor }} the token
 * @returns {JSX.Element} the row
 */
export const TokenRow = ({ color }: { color: BrandColor }) => (
  <div className={panelClasses({ padding: "md", className: "flex items-center gap-4" })}>
    <span
      aria-hidden
      className="size-12 flex-none rounded border border-evergreen-800/60"
      style={{ backgroundColor: color.hex }}
    />
    <div className="flex min-w-0 flex-col">
      <span className="font-semibold text-evergreen-50 text-sm">{color.usage}</span>
      <span className="font-mono text-fog-300 text-xs">{color.hex}</span>
      <span className="font-mono text-fog-500 text-xs">{color.token}</span>
    </div>
  </div>
);
