/**
 * @file src/components/tournament/RosterCard.tsx
 * @desc A team's card: the tag chip in the team color, the name, a status note, the roster
 *       with captains flagged, and an optional footer (an availability grid). Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { DisplayHeading, type HeadingLevel } from "../basics/DisplayHeading.js";
import { labelClasses } from "../basics/labelStyles.js";
import { DIVIDER, panelClasses } from "../basics/panelStyles.js";
import { PlayerIdentity } from "../osu/PlayerIdentity.js";

/** One roster member. */
export type RosterMember = {
  username: string;
  osuId?: number | null | undefined;
  avatarUrl?: string | null | undefined;
  isCaptain?: boolean | undefined;
};

/** The team, its members and the extras. */
export type RosterCardProps = {
  tag: string;
  name: string;
  members: readonly RosterMember[];
  /** The tag's color (a team color hex). */
  color?: string | null | undefined;
  /** A bark note after the name ("withdrawn"). */
  note?: string | null | undefined;
  /** Content under a divider (availability). */
  footer?: ReactNode;
  level?: HeadingLevel | undefined;
};

/**
 * @function RosterCard
 * @param props {RosterCardProps} tag, name, members, color, note, footer and level (default 2)
 * @returns {JSX.Element} the team article
 */
export const RosterCard = ({
  tag,
  name,
  members,
  color,
  note,
  footer,
  level = 2,
}: RosterCardProps) => (
  <article className={panelClasses({ className: "flex flex-col gap-4" })}>
    <header className="flex flex-wrap items-baseline gap-3">
      <span
        className={labelClasses({ tone: "evergreen", size: "md", className: "text-xs" })}
        style={color ? { color } : undefined}
      >
        {tag}
      </span>
      <DisplayHeading level={level}>{name}</DisplayHeading>
      {note ? (
        <span className={labelClasses({ tone: "bark", className: "font-normal tracking-[0.2em]" })}>
          {note}
        </span>
      ) : null}
    </header>
    <ul className="flex flex-col gap-2">
      {members.map((m) => (
        <li key={m.username}>
          <PlayerIdentity
            username={m.username}
            osuId={m.osuId}
            avatarUrl={m.avatarUrl}
            note={m.isCaptain ? "captain" : undefined}
          />
        </li>
      ))}
    </ul>
    {footer ? <div className={`flex flex-col gap-2 ${DIVIDER}`}>{footer}</div> : null}
  </article>
);
