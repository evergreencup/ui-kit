/**
 * @file src/components/tournament/FundingMeter.tsx
 * @desc The crowdfund meter: the raised total in big display type over the goal, the
 *       contribution count, the progress bar with its percentage, the stretch tiers, and an
 *       optional call-to-action block under a divider. Without a goal it says "Goal pending".
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { formatUsd, padCount, percentOf } from "../../utils/format.js";
import { Eyebrow } from "../basics/Eyebrow.js";
import { ProgressBar } from "../basics/ProgressBar.js";
import { panelClasses } from "../basics/panelStyles.js";
import { type StretchTier, StretchTiers } from "./StretchTiers.js";

/** The money, the count, the tiers and the block under the meter. */
export type FundingMeterProps = {
  raisedCents: number;
  /** The goal; null or 0 while it isn't set. */
  goalCents: number | null;
  count: number;
  tiers?: readonly StretchTier[] | undefined;
  /** Copy and buttons under the meter ("Fund the Cup" and the Ko-fi link). */
  children?: ReactNode;
};

/**
 * @function FundingMeter
 * @param props {FundingMeterProps} raisedCents, goalCents, count, tiers and children
 * @returns {JSX.Element} the meter panel
 */
export const FundingMeter = ({
  raisedCents,
  goalCents,
  count,
  tiers = [],
  children,
}: FundingMeterProps) => {
  const goal = goalCents ?? 0;
  const hasGoal = goal > 0;
  const pct = Math.round(percentOf(raisedCents, goal));
  return (
    <div className={panelClasses({ padding: "xl", className: "flex flex-col gap-8" })}>
      <div className="flex flex-col gap-2">
        <Eyebrow as="p">{hasGoal ? "Goal" : "Goal pending"}</Eyebrow>
        <p className="flex flex-wrap items-baseline gap-3">
          <span className="font-black font-display text-5xl text-evergreen-50 leading-none tracking-[-0.03em] sm:text-6xl">
            {formatUsd(raisedCents)}
          </span>
          {hasGoal ? (
            <span className="font-mono text-fog-400 text-sm tracking-[0.1em]">
              / {formatUsd(goal)}
            </span>
          ) : null}
        </p>
        <p className="font-mono text-[11px] text-fog-500 tracking-[0.16em]">
          {padCount(count)} {count === 1 ? "contribution" : "contributions"} so far
        </p>
      </div>
      {hasGoal ? (
        <div className="flex flex-col gap-4">
          <ProgressBar value={raisedCents} max={goal} label="Crowdfund progress" />
          <Eyebrow as="p" tone="evergreen" size="md">
            {pct.toString()}% of goal
          </Eyebrow>
          {tiers.length > 0 ? (
            <StretchTiers goalCents={goal} raisedCents={raisedCents} tiers={tiers} />
          ) : null}
        </div>
      ) : null}
      {children ? (
        <div className="flex flex-col gap-3 border-evergreen-800/40 border-t pt-6">{children}</div>
      ) : null}
    </div>
  );
};
