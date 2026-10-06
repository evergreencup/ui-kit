/**
 * @file src/components/osu/PlayerIdentity.tsx
 * @desc A player's square osu! avatar beside their name, the name linking to their profile
 *       when the id is known, with an optional trailing note ("captain") and a sub-line.
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { labelClasses } from "../basics/labelStyles.js";
import { GUEST_AVATAR, profileUrl } from "./osuLinks.js";

/** Who the player is, the avatar size, and what to show around the name. */
export type PlayerIdentityProps = {
  username: string;
  osuId?: number | null | undefined;
  avatarUrl?: string | null | undefined;
  size?: "sm" | "md" | undefined;
  /** A mono note after the name, e.g. "captain". */
  note?: ReactNode;
  /** A line under the name, e.g. the region. */
  sub?: ReactNode;
  /** Color the name cascade (captains on the player wall). */
  highlight?: boolean | undefined;
  className?: string | undefined;
};

/**
 * @function PlayerIdentity
 * @param props {PlayerIdentityProps} username, osuId, avatarUrl, size (default "sm" 32px, "md"
 *        40px), note, sub, highlight and className
 * @returns {JSX.Element} the avatar and name row
 */
export const PlayerIdentity = ({
  username,
  osuId,
  avatarUrl,
  size = "sm",
  note,
  sub,
  highlight = false,
  className,
}: PlayerIdentityProps) => {
  const nameClass = cx(
    "truncate rounded-sm font-semibold text-sm transition",
    highlight
      ? "text-cascade-300 hover:text-cascade-200"
      : "text-evergreen-50 hover:text-evergreen-200",
  );
  return (
    <div className={cx("flex min-w-0 items-center gap-3", className)}>
      {/* biome-ignore lint/performance/noImgElement: osu! avatars stay out of next/image's host list */}
      <img
        src={avatarUrl ?? GUEST_AVATAR}
        alt=""
        loading="lazy"
        className={cx(
          "shrink-0 rounded-sm border border-evergreen-800/60 object-cover",
          size === "md" ? "size-10" : "size-8",
        )}
      />
      <div className="flex min-w-0 flex-col">
        <span className="flex min-w-0 items-center gap-2">
          {osuId ? (
            <a
              href={profileUrl(osuId)}
              target="_blank"
              rel="noreferrer"
              className={cx(nameClass, FOCUS_RING)}
            >
              {username}
            </a>
          ) : (
            <span className={nameClass}>{username}</span>
          )}
          {note ? (
            <span className={labelClasses({ tone: "evergreen", className: "tracking-[0.2em]" })}>
              {note}
            </span>
          ) : null}
        </span>
        {sub ? <span className="text-[11px] text-fog-400">{sub}</span> : null}
      </div>
    </div>
  );
};
