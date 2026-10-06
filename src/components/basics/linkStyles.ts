/**
 * @file src/components/basics/linkStyles.ts
 * @desc Class strings for links: the underlined inline link in prose, and the quiet link in
 *       footers and meta lines.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { FOCUS_RING } from "./focusStyles.js";

/** `inline` underlined in prose, `quiet` fog text that lights up on hover. */
export type LinkVariant = "inline" | "quiet";

/** The finished classes per link variant. */
export const LINK_CLASSES: Record<LinkVariant, string> = {
  inline: `rounded-sm text-evergreen-200 underline decoration-evergreen-600 underline-offset-4 transition hover:text-evergreen-50 ${FOCUS_RING}`,
  quiet: `rounded-sm transition-colors hover:text-evergreen-50 ${FOCUS_RING}`,
};
