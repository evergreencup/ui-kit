/**
 * @file src/components/tournament/StretchTiers.tsx
 * @desc Stretch goals on a scale from $0 to the goal (or the top tier): tick marks along a
 *       track, then a card per tier, evergreen once cleared. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { formatUsd, percentOf } from "../../utils/format.js";
import { headingClasses } from "../basics/headingStyles.js";
import { labelClasses } from "../basics/labelStyles.js";
import { panelClasses } from "../basics/panelStyles.js";

/** One stretch goal: its threshold, name and what it unlocks. */
export type StretchTier = { thresholdCents: number; label: string; description: string };

/** The goal, the amount raised and the tiers. */
export type StretchTiersProps = {
  goalCents: number;
  raisedCents: number;
  tiers: readonly StretchTier[];
};

/**
 * @function StretchTiers
 * @param props {StretchTiersProps} goalCents, raisedCents and tiers (any order)
 * @returns {JSX.Element} the tick track and the tier cards, sorted by threshold
 */
export const StretchTiers = ({ goalCents, raisedCents, tiers }: StretchTiersProps) => {
  const sorted = [...tiers].sort((a, b) => a.thresholdCents - b.thresholdCents);
  const scale = Math.max(goalCents, sorted.at(-1)?.thresholdCents ?? 0, 1);
  const key = (t: StretchTier) => `${t.thresholdCents.toString()}-${t.label}`;
  return (
    <div className="flex flex-col gap-2">
      <div aria-hidden className="relative h-1 w-full">
        {sorted.map((t) => (
          <span
            key={key(t)}
            className={cx(
              "absolute -top-0.5 h-2.5 w-0.5",
              raisedCents >= t.thresholdCents ? "bg-evergreen-400" : "bg-fog-500/60",
            )}
            style={{ left: `${percentOf(t.thresholdCents, scale).toString()}%` }}
          />
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((t) => {
          const cleared = raisedCents >= t.thresholdCents;
          return (
            <li
              key={key(t)}
              className={panelClasses({
                tone: cleared ? "active" : "default",
                padding: "sm",
                className: "flex flex-col gap-1",
              })}
            >
              <span
                className={labelClasses({
                  tone: cleared ? "evergreen" : "fog",
                  className: "font-normal tracking-[0.2em]",
                })}
              >
                {formatUsd(t.thresholdCents)}
                {cleared ? " · cleared" : ""}
              </span>
              <span className={headingClasses("sm", "font-bold text-sm")}>{t.label}</span>
              <span className="text-fog-400 text-xs">{t.description}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
