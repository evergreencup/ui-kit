/**
 * @file src/components/tournament/statuses.ts
 * @desc The cup's workflow statuses (registrations, LAN signups, team standing) with their
 *       labels and the badge tone each wears.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { StatusTone } from "../basics/badgeStyles.js";

/** Every status a registration, LAN signup or team can be in. */
export type Status =
  | "pending"
  | "approved"
  | "accepted"
  | "waitlisted"
  | "rejected"
  | "withdrawn"
  | "disqualified"
  | "active";

/** The tone and label per status. */
export const STATUSES: Record<Status, { tone: StatusTone; label: string }> = {
  pending: { tone: "warning", label: "pending" },
  approved: { tone: "success", label: "approved" },
  accepted: { tone: "success", label: "accepted" },
  waitlisted: { tone: "info", label: "waitlist" },
  rejected: { tone: "danger", label: "rejected" },
  withdrawn: { tone: "neutral", label: "withdrawn" },
  disqualified: { tone: "danger", label: "disqualified" },
  active: { tone: "success", label: "active" },
};
