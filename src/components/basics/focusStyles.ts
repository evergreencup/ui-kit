/**
 * @file src/components/basics/focusStyles.ts
 * @desc The one keyboard focus ring: a 2px evergreen-400 ring offset from the Pitch page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** Focus ring for anything focusable: no outline on mouse focus, a 2px ring on keyboard focus. */
export const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-evergreen-400 focus-visible:ring-offset-2 focus-visible:ring-offset-evergreen-950";
