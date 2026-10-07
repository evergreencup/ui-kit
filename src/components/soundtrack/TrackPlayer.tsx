/**
 * @file src/components/soundtrack/TrackPlayer.tsx
 * @desc A track's audio, embedded the way its provider allows: a 16:9 YouTube player, the
 *       SoundCloud widget, a native audio element, or a "Listen" link. With no provider, one is
 *       guessed from the URL. Nothing renders without a URL. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { ButtonLink } from "../basics/ButtonLink.js";
import { HAIRLINE } from "../basics/panelStyles.js";
import { ArrowRightIcon } from "../icons/icons.js";
import {
  type AudioProvider,
  guessProvider,
  soundcloudPlayerUrl,
  youtubeId,
} from "./trackEmbeds.js";

/** Where the audio is, and the title the embeds are named with. */
export type TrackPlayerProps = {
  url: string | null | undefined;
  provider?: AudioProvider | null | undefined;
  title?: string | null | undefined;
};

const FRAME = cx("w-full overflow-hidden rounded-sm border", HAIRLINE);

/**
 * @function TrackPlayer
 * @param props {TrackPlayerProps} url, provider (guessed when missing) and title (default "Track")
 * @returns {JSX.Element | null} the embed, or null without a URL
 */
export const TrackPlayer = ({ url, provider, title }: TrackPlayerProps) => {
  if (!url) return null;
  const label = title ?? "Track";
  const kind = provider ?? guessProvider(url);
  const video = kind === "youtube" ? youtubeId(url) : null;
  if (video)
    return (
      <div className={FRAME}>
        <iframe
          src={`https://www.youtube.com/embed/${video}`}
          title={`${label} on YouTube`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>
    );
  if (kind === "soundcloud")
    return (
      <div className={FRAME}>
        <iframe
          src={soundcloudPlayerUrl(url)}
          title={`${label} on SoundCloud`}
          allow="autoplay"
          className="h-[180px] w-full"
        />
      </div>
    );
  if (kind === "direct")
    return (
      // biome-ignore lint/a11y/useMediaCaption: soundtrack audio has no captions to offer
      <audio controls src={url} aria-label={label} className={cx(FRAME, "bg-evergreen-950")} />
    );
  return (
    <ButtonLink href={url} variant="outline" size="sm" newTab className="self-start">
      Listen <ArrowRightIcon className="size-3" />
    </ButtonLink>
  );
};
