/**
 * @file src/components/basics/badgeStyles.ts
 * @desc The status tones every badge and chip shares: a translucent fill, a matching edge and
 *       light text per tone.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** success evergreen, warning bark, info cascade, danger red, neutral fog. */
export type StatusTone = "success" | "warning" | "info" | "danger" | "neutral";

/** Border, fill and text per tone. */
export const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
  success: "border-evergreen-400/60 bg-evergreen-500/20 text-evergreen-100",
  warning: "border-bark-400/50 bg-bark-950/40 text-bark-100",
  info: "border-cascade-400/50 bg-cascade-950/30 text-cascade-100",
  danger: "border-red-400/50 bg-red-950/40 text-red-200",
  neutral: "border-fog-500/40 bg-fog-900/30 text-fog-200",
};
