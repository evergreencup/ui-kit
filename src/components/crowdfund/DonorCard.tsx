/**
 * @file src/components/crowdfund/DonorCard.tsx
 * @desc One row on the donor wall: an optional rank, the avatar and name, a "recurring" tag,
 *       the message, the date and the amount. Renders an li. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { formatShortDate, padCount } from "../../utils/format.js";
import { headingClasses } from "../basics/headingStyles.js";
import { labelClasses } from "../basics/labelStyles.js";
import { panelClasses } from "../basics/panelStyles.js";
import { DonorAvatar } from "./DonorAvatar.js";
import { DonorName } from "./DonorName.js";
import { type Donor, donorAmount } from "./donors.js";

/** The donor and, on the top list, their place. */
export type DonorCardProps = { donor: Donor; rank?: number | undefined };

/**
 * @function DonorCard
 * @param props {DonorCardProps} donor and rank
 * @returns {JSX.Element} the list item
 */
export const DonorCard = ({ donor, rank }: DonorCardProps) => (
  <li
    className={panelClasses({
      padding: "md",
      interactive: true,
      className: "flex items-start gap-4",
    })}
  >
    {rank !== undefined ? (
      <span
        className={headingClasses(
          "lg",
          "w-10 shrink-0 text-right text-evergreen-700 leading-tight",
        )}
      >
        {padCount(rank, 2)}
      </span>
    ) : null}
    <DonorAvatar src={donor.avatarUrl} size="md" />
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline gap-2">
        <DonorName donor={donor} className="text-base" />
        {donor.recurring ? (
          <span
            className={labelClasses({
              tone: "moss",
              size: "xs",
              className: "rounded-sm bg-moss-900/50 px-1.5 py-0.5 font-normal text-moss-300",
            })}
          >
            recurring
          </span>
        ) : null}
      </div>
      {donor.message ? (
        <blockquote className="text-fog-300 text-sm italic">“{donor.message}”</blockquote>
      ) : null}
      {donor.date ? (
        <span className="font-mono text-[10px] text-fog-500 tracking-[0.18em]">
          {formatShortDate(donor.date)}
        </span>
      ) : null}
    </div>
    <span className="font-mono text-evergreen-100 text-sm tracking-[0.06em]">
      {donorAmount(donor)}
    </span>
  </li>
);
