/**
 * @file src/components/layout/AccountPill.tsx
 * @desc The signed-in pill for the header: the osu! avatar (or a blank disc), the username and
 *       an optional admin badge, linking to the dashboard. Presentational: the app reads the
 *       session and passes the user. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { AutoLink } from "../basics/AutoLink.js";
import { FOCUS_RING } from "../basics/focusStyles.js";

/** Who is signed in, where the pill links, and the admin flag. */
export type AccountPillProps = {
  username: string;
  avatarUrl?: string | null | undefined;
  href?: string | undefined;
  isAdmin?: boolean | undefined;
  className?: string | undefined;
};

/**
 * @function AccountPill
 * @param props {AccountPillProps} username, avatarUrl, href (default "/dashboard"), isAdmin and
 *        className
 * @returns {JSX.Element} the pill link
 */
export const AccountPill = ({
  username,
  avatarUrl,
  href = "/dashboard",
  isAdmin = false,
  className,
}: AccountPillProps) => (
  <AutoLink
    href={href}
    className={cx(
      "inline-flex items-center gap-2 rounded-full border border-evergreen-800 bg-evergreen-900/50 py-1 pr-4 pl-1 font-medium text-evergreen-100 text-sm transition hover:border-evergreen-500",
      FOCUS_RING,
      className,
    )}
  >
    {avatarUrl ? (
      // biome-ignore lint/performance/noImgElement: osu! avatars stay out of next/image's host list
      <img
        src={avatarUrl}
        alt=""
        width={28}
        height={28}
        className="size-7 rounded-full border border-evergreen-700 object-cover"
      />
    ) : (
      <span aria-hidden className="size-7 rounded-full bg-evergreen-700" />
    )}
    <span className="max-w-32 truncate">{username}</span>
    {isAdmin ? (
      <span className="rounded-full bg-evergreen-500/20 px-2 py-0.5 font-semibold text-[10px] text-evergreen-200 uppercase tracking-wider">
        admin
      </span>
    ) : null}
  </AutoLink>
);
