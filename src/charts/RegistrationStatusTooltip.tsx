/**
 * @file src/charts/RegistrationStatusTooltip.tsx
 * @desc The registration chart's tooltip: the kind ("Player") and each non-zero status count
 *       with its swatch. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { ChartTooltip } from "../components/data/ChartTooltip.js";
import type { TooltipContent } from "./tooltipPayload.js";

/**
 * @function RegistrationStatusTooltip
 * @param props {TooltipContent<unknown>} Recharts' tooltip props; label is the kind
 * @returns {JSX.Element | null} the panel, or null while idle
 */
export const RegistrationStatusTooltip = ({
  active,
  payload = [],
  label,
}: TooltipContent<unknown>) => {
  if (!active || payload.length === 0) return null;
  const kind = String(label ?? "");
  return (
    <ChartTooltip
      heading={kind.charAt(0).toUpperCase() + kind.slice(1)}
      rows={payload
        .filter((p) => typeof p.value === "number" && p.value > 0)
        .map((p) => ({ label: String(p.name), value: String(p.value), swatch: p.color }))}
    />
  );
};
