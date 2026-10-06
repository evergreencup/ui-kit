/**
 * @file src/components/atmosphere/MountRainier.tsx
 * @desc Mt. Rainier's silhouette: the broad stratovolcano with its east-leaning summit and the
 *       Little Tahoma shoulder, a fading snow cap and a faint ridge line. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { useId } from "react";
import { LAYER, parallaxStyle } from "./parallax.js";

/** Horizontal offset (-1 to 1), scale and parallax depth. */
export type MountRainierProps = {
  offsetX?: number | undefined;
  scale?: number | undefined;
  depth?: number | undefined;
};

const MOUNTAIN =
  "M0 420 L0 360 L180 340 L330 300 L450 266 L560 232 L640 202 L710 176 L760 154 L800 142 L828 148 L872 130 L920 150 L968 166 L1020 190 L1078 214 L1150 240 L1230 268 L1320 296 L1420 320 L1520 344 L1600 360 L1600 420 Z";
const SNOW =
  "M640 202 L710 176 L760 154 L800 142 L828 148 L872 130 L920 150 L968 166 L1020 190 L1000 196 L960 178 L912 164 L868 146 L830 162 L800 154 L764 168 L728 186 L680 204 Z";
const RIDGE = "M760 154 L800 142 L828 148 L872 130";

/**
 * @function MountRainier
 * @param props {MountRainierProps} offsetX (default 0), scale (default 1), depth (default 3)
 * @returns {JSX.Element} the mountain layer, aria-hidden
 */
export const MountRainier = ({ offsetX = 0, scale = 1, depth = 3 }: MountRainierProps) => {
  const id = useId();
  return (
    <div
      aria-hidden
      className={`${LAYER} inset-x-0 top-[10%] bottom-[35%]`}
      style={parallaxStyle(depth, {
        transform: `translate3d(${(offsetX * 8).toString()}%, 0, 0) scale(${scale.toString()})`,
        transformOrigin: "center bottom",
      })}
    >
      <svg
        aria-hidden
        viewBox="0 0 1600 420"
        preserveAspectRatio="xMidYMax meet"
        className="size-full"
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a301a" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#082515" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#051a0d" />
          </linearGradient>
          <linearGradient id={`${id}-snow`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#edf2f4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#bcc8cd" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={MOUNTAIN} fill={`url(#${id}-fill)`} />
        <path d={SNOW} fill={`url(#${id}-snow)`} />
        <path d={RIDGE} stroke="#edf2f4" strokeOpacity="0.25" strokeWidth="1.2" fill="none" />
      </svg>
    </div>
  );
};
