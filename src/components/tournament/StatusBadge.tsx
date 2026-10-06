/**
 * @file src/components/tournament/StatusBadge.tsx
 * @desc A Badge for a workflow status, in that status's tone and label (overridable).
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { Badge, type BadgeProps } from "../basics/Badge.js";
import { STATUSES, type Status } from "./statuses.js";

/** Badge props without the tone, plus the status and an optional label. */
export type StatusBadgeProps = Omit<BadgeProps, "tone" | "children"> & {
  status: Status;
  label?: string | undefined;
};

/**
 * @function StatusBadge
 * @param props {StatusBadgeProps} status, label (default the status's) and badge props
 * @returns {JSX.Element} the badge
 */
export const StatusBadge = ({ status, label, ...props }: StatusBadgeProps) => (
  <Badge tone={STATUSES[status].tone} {...props}>
    {label ?? STATUSES[status].label}
  </Badge>
);
