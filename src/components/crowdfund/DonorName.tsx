/**
 * @file src/components/crowdfund/DonorName.tsx
 * @desc A donor's name in the display face, linking to their osu! profile when the id is known.
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { profileUrl } from "../osu/osuLinks.js";
import type { Donor } from "./donors.js";

/**
 * @function DonorName
 * @param props {{ donor: Donor; className?: string }} the donor and size classes
 * @returns {JSX.Element} a profile link or plain name
 */
export const DonorName = ({ donor, className }: { donor: Donor; className?: string }) => {
  const classes = cx(
    "truncate rounded-sm font-bold font-display text-evergreen-50 tracking-[-0.01em]",
    className,
  );
  return donor.osuId ? (
    <a
      href={profileUrl(donor.osuId)}
      target="_blank"
      rel="noreferrer"
      className={cx(classes, "transition hover:text-evergreen-200", FOCUS_RING)}
    >
      {donor.name}
    </a>
  ) : (
    <span className={classes}>{donor.name}</span>
  );
};
