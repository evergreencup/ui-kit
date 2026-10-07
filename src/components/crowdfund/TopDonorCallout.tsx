/**
 * @file src/components/crowdfund/TopDonorCallout.tsx
 * @desc The "currently leading the wall" highlight for the top donor, or an invitation to take
 *       the spot when there is none (or every top donor is anonymous). Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { Eyebrow } from "../basics/Eyebrow.js";
import { headingClasses } from "../basics/headingStyles.js";
import { panelClasses } from "../basics/panelStyles.js";
import { DonorAvatar } from "./DonorAvatar.js";
import { DonorName } from "./DonorName.js";
import { type Donor, donorAmount } from "./donors.js";

/** The leader, and the copy around them. */
export type TopDonorCalloutProps = {
  donor: Donor | null;
  /** Over the name (default "Currently leading the wall"). */
  label?: string | undefined;
  /** When there is no leader (default "Be the first to claim the top spot."). */
  empty?: string | undefined;
};

/**
 * @function TopDonorCallout
 * @param props {TopDonorCalloutProps} donor, label and empty
 * @returns {JSX.Element} the callout panel
 */
export const TopDonorCallout = ({
  donor,
  label = "Currently leading the wall",
  empty = "Be the first to claim the top spot.",
}: TopDonorCalloutProps) =>
  donor ? (
    <div className={panelClasses({ tone: "raised", className: "flex items-center gap-4" })}>
      <span
        aria-hidden
        className={headingClasses(
          "hero",
          "text-4xl text-moss-300 leading-none sm:text-5xl md:text-5xl",
        )}
      >
        01
      </span>
      <DonorAvatar src={donor.avatarUrl} size="lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Eyebrow>{label}</Eyebrow>
        <DonorName donor={donor} className="text-xl" />
        <span className="font-mono text-evergreen-200 text-sm tracking-[0.08em]">
          {donorAmount(donor)}
        </span>
      </div>
    </div>
  ) : (
    <div className={panelClasses({ className: "flex flex-col gap-2" })}>
      <Eyebrow>Top donor</Eyebrow>
      <p className="text-fog-400 text-sm">{empty}</p>
    </div>
  );
