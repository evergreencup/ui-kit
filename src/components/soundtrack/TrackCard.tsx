/**
 * @file src/components/soundtrack/TrackCard.tsx
 * @desc One soundtrack entry: cover art (or the track number on a tile), "Track 01 · round ·
 *       length", the title, the songwriter credits, and the player. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { Fragment } from "react";
import { formatMmSs, padCount } from "../../utils/format.js";
import { AutoLink } from "../basics/AutoLink.js";
import { DisplayHeading, type HeadingLevel } from "../basics/DisplayHeading.js";
import { Eyebrow } from "../basics/Eyebrow.js";
import { headingClasses } from "../basics/headingStyles.js";
import { LINK_CLASSES } from "../basics/linkStyles.js";
import { HAIRLINE, panelClasses } from "../basics/panelStyles.js";
import { TrackPlayer } from "./TrackPlayer.js";
import type { AudioProvider } from "./trackEmbeds.js";

/** One track's public data. */
export type Track = {
  index: number;
  title?: string | null | undefined;
  roundLabel?: string | null | undefined;
  lengthSeconds?: number | null | undefined;
  coverUrl?: string | null | undefined;
  audioUrl?: string | null | undefined;
  audioProvider?: AudioProvider | null | undefined;
};

/** A credited songwriter, linking somewhere when given an href. */
export type Songwriter = { name: string; href?: string | undefined };

/** The track, its songwriters and the heading level. */
export type TrackCardProps = {
  track: Track;
  songwriters?: readonly Songwriter[] | undefined;
  level?: HeadingLevel | undefined;
};

/**
 * @function creditSeparator
 * @param i {number} a name's position
 * @param count {number} how many names
 * @returns {string} what follows it: ", " between, " & " before the last, nothing after it
 */
export const creditSeparator = (i: number, count: number): string =>
  i === count - 1 ? "" : i === count - 2 ? " & " : ", ";

/**
 * @function TrackCard
 * @param props {TrackCardProps} track, songwriters and level (default 3)
 * @returns {JSX.Element} the track article
 */
export const TrackCard = ({ track, songwriters = [], level = 3 }: TrackCardProps) => {
  const num = padCount(track.index, 2);
  const title = track.title ?? "Untitled";
  const meta = [
    `Track ${num}`,
    track.roundLabel,
    track.lengthSeconds != null ? formatMmSs(track.lengthSeconds) : null,
  ].filter(Boolean);
  return (
    <article
      className={panelClasses({
        padding: "xl",
        interactive: true,
        className: "flex flex-col gap-5",
      })}
    >
      <header className="flex items-start gap-4">
        {track.coverUrl ? (
          // biome-ignore lint/performance/noImgElement: cover art is any URL the app hosts
          <img
            src={track.coverUrl}
            alt={`${title} cover art`}
            loading="lazy"
            className="size-24 shrink-0 rounded-sm border border-evergreen-700 object-cover"
          />
        ) : (
          <span
            aria-hidden
            className={`flex size-24 shrink-0 items-center justify-center rounded-sm border bg-evergreen-900/60 ${HAIRLINE}`}
          >
            <span className={headingClasses("lg", "text-evergreen-600")}>{num}</span>
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Eyebrow tone="fog">{meta.join(" · ")}</Eyebrow>
          <DisplayHeading level={level} size="lg" className="normal-case leading-tight">
            {title}
          </DisplayHeading>
          {songwriters.length > 0 ? (
            <p className="text-fog-400 text-sm">
              by{" "}
              {songwriters.map((s, i) => (
                <Fragment key={s.name}>
                  {s.href ? (
                    <AutoLink href={s.href} className={LINK_CLASSES.inline}>
                      {s.name}
                    </AutoLink>
                  ) : (
                    <span className="text-evergreen-200">{s.name}</span>
                  )}
                  {creditSeparator(i, songwriters.length)}
                </Fragment>
              ))}
            </p>
          ) : null}
        </div>
      </header>
      <TrackPlayer url={track.audioUrl} provider={track.audioProvider} title={track.title} />
    </article>
  );
};
