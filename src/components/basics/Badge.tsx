/**
 * @file src/components/basics/Badge.tsx
 * @desc A small uppercase status pill (approved, waitlist, admin). Static text: no role, so
 *       screen readers read it in place. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { cx } from "../../utils/cx.js";
import { STATUS_TONE_CLASSES, type StatusTone } from "./badgeStyles.js";

/** Native span props, plus a tone and a shape. */
export type BadgeProps = ComponentProps<"span"> & {
  tone?: StatusTone | undefined;
  /** Fully rounded instead of 2px corners. */
  pill?: boolean | undefined;
};

/**
 * @function Badge
 * @param props {BadgeProps} tone (default "neutral"), pill and native span props
 * @returns {JSX.Element} the badge
 */
export const Badge = ({ tone = "neutral", pill = false, className, ...props }: BadgeProps) => (
  <span
    className={cx(
      "inline-flex items-center whitespace-nowrap border px-2 py-0.5 font-semibold text-[10px] uppercase tracking-[0.18em] forced-colors:border",
      pill ? "rounded-full" : "rounded-sm",
      STATUS_TONE_CLASSES[tone],
      className,
    )}
    {...props}
  />
);
