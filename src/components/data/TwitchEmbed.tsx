/**
 * @file src/components/data/TwitchEmbed.tsx
 * @desc The Twitch player iframe at 16:9, muted autoplay, with the parent hosts Twitch requires.
 *       `mini` caps it at max-w-sm for side placement. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { HAIRLINE } from "../basics/panelStyles.js";

/**
 * @function twitchPlayerUrl
 * @param channel {string} a Twitch login
 * @param parents {readonly string[]} every host the page is served from (Twitch refuses others)
 * @returns {string} the player.twitch.tv iframe src, muted with autoplay
 */
export const twitchPlayerUrl = (channel: string, parents: readonly string[]): string => {
  const params = new URLSearchParams({ channel, muted: "true", autoplay: "true" });
  for (const parent of parents) params.append("parent", parent);
  return `https://player.twitch.tv/?${params.toString()}`;
};

/** The channel, the allowed parent hosts, and the size. */
export type TwitchEmbedProps = {
  channel: string;
  parents: readonly string[];
  variant?: "full" | "mini" | undefined;
  className?: string | undefined;
};

/**
 * @function TwitchEmbed
 * @param props {TwitchEmbedProps} channel, parents, variant (default "full") and className
 * @returns {JSX.Element} the framed player
 */
export const TwitchEmbed = ({
  channel,
  parents,
  variant = "full",
  className,
}: TwitchEmbedProps) => (
  <div
    className={cx(
      "w-full overflow-hidden rounded-sm border",
      HAIRLINE,
      variant === "mini" && "max-w-sm",
      className,
    )}
  >
    <iframe
      src={twitchPlayerUrl(channel, parents)}
      title={`${channel} on Twitch`}
      allowFullScreen
      className="aspect-video w-full"
    />
  </div>
);
