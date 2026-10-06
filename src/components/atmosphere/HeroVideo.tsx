/**
 * @file src/components/atmosphere/HeroVideo.tsx
 * @desc Full-bleed looping background video: the poster paints first (the only frame under
 *       reduced motion, which never downloads the clip), the muted video fades in once it can play,
 *       optional rain or snow drifts over it, and a scrim keeps copy legible. Client.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionEnabled } from "../../hooks/useMediaQuery.js";
import { cx } from "../../utils/cx.js";
import type { Intensity } from "./particles.js";
import { RainLayer, SnowLayer } from "./Weather.js";

/** The clip's sources, overlays, framing and scrim. */
export type HeroVideoProps = {
  poster: string;
  webm?: string | undefined;
  mp4?: string | undefined;
  rain?: Intensity | undefined;
  snow?: Intensity | undefined;
  /** CSS object-position for the poster and video (default "center"). */
  objectPosition?: string | undefined;
  /** Darken the lower left for copy (default true). */
  scrim?: boolean | undefined;
  /** Wrapper classes (default -z-10). */
  className?: string | undefined;
};

/**
 * @function HeroVideo
 * @param props {HeroVideoProps} poster, webm, mp4, rain, snow, objectPosition, scrim, className
 * @returns {JSX.Element} the absolutely positioned backdrop, aria-hidden
 */
export const HeroVideo = ({
  poster,
  webm,
  mp4,
  rain,
  snow,
  objectPosition = "center",
  scrim = true,
  className = "-z-10",
}: HeroVideoProps) => {
  const motion = useMotionEnabled();
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLVideoElement | null>(null);
  const hasClip = Boolean(webm || mp4);

  useEffect(() => {
    // Some browsers reject autoplay until the element is muted and in view; the poster stays.
    if (motion) ref.current?.play().catch(() => undefined);
  }, [motion]);

  return (
    <div aria-hidden className={cx("absolute inset-0 overflow-hidden bg-evergreen-950", className)}>
      {/* biome-ignore lint/performance/noImgElement: a decorative full-bleed backdrop */}
      <img
        src={poster}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition }}
      />
      {motion && hasClip ? (
        <video
          ref={ref}
          className={cx(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
          style={{ objectPosition }}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => {
            setReady(true);
          }}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          {mp4 ? <source src={mp4} type="video/mp4" /> : null}
        </video>
      ) : null}
      {rain ? <RainLayer intensity={rain} opacity={0.45} /> : null}
      {snow ? <SnowLayer intensity={snow} opacity={0.85} /> : null}
      {scrim ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-evergreen-950 via-evergreen-950/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-evergreen-950/80 to-transparent" />
        </>
      ) : null}
    </div>
  );
};
