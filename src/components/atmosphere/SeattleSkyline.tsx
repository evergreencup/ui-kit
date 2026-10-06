/**
 * @file src/components/atmosphere/SeattleSkyline.tsx
 * @desc The Seattle skyline at low alpha in rain-800: Smith Tower, Columbia Center, the
 *       Bank of America tower, the Space Needle and the mid-rise fill between. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { LAYER, parallaxStyle } from "./parallax.js";

/** Horizontal offset (-1 to 1), alpha and parallax depth. */
export type SeattleSkylineProps = {
  offsetX?: number | undefined;
  opacity?: number | undefined;
  depth?: number | undefined;
};

/** Building blocks as [x, y, width, height], left to right. */
const BLOCKS: readonly (readonly [number, number, number, number])[] = [
  [60, 130, 60, 50],
  [125, 118, 70, 62],
  [210, 90, 46, 90],
  [230, 50, 6, 14],
  [275, 122, 52, 58],
  [332, 112, 48, 68],
  [444, 20, 8, 14],
  [520, 118, 60, 62],
  [585, 104, 56, 76],
  [650, 64, 68, 116],
  [658, 56, 52, 10],
  [682, 44, 6, 14],
  [732, 112, 50, 68],
  [788, 120, 56, 60],
  [850, 108, 48, 72],
  [903, 118, 52, 62],
  [962, 104, 60, 76],
  [1028, 120, 46, 60],
  [1082, 98, 56, 82],
  [1144, 114, 48, 66],
  [1244, 56, 8, 24],
  [1247, 44, 3, 14],
  [1296, 126, 58, 54],
  [1360, 116, 64, 64],
  [1430, 130, 52, 50],
  [1488, 122, 70, 58],
];

/** Pointed shapes: Smith Tower's cap, Columbia Center, the Needle's legs. */
const SPIRES = [
  "210,90 233,62 256,90",
  "400,180 400,44 432,32 464,32 496,44 496,180",
  "1230,180 1244,110 1252,110 1266,180",
];

/**
 * @function SeattleSkyline
 * @param props {SeattleSkylineProps} offsetX (default 0), opacity (default 0.28), depth (default 5)
 * @returns {JSX.Element} the skyline layer, aria-hidden
 */
export const SeattleSkyline = ({ offsetX = 0, opacity = 0.28, depth = 5 }: SeattleSkylineProps) => (
  <div
    aria-hidden
    className={`${LAYER} inset-x-0 bottom-[32%] h-[22%]`}
    style={parallaxStyle(depth, {
      transform: `translate3d(${(offsetX * 10).toString()}%, 0, 0)`,
      opacity,
    })}
  >
    <svg
      aria-hidden
      viewBox="0 0 1600 180"
      preserveAspectRatio="xMidYMax meet"
      className="size-full"
    >
      <g fill="var(--color-rain-800)">
        {BLOCKS.map(([x, y, width, height]) => (
          <rect key={`${x.toString()}-${y.toString()}`} x={x} y={y} width={width} height={height} />
        ))}
        {SPIRES.map((points) => (
          <polygon key={points} points={points} />
        ))}
        <ellipse cx="1248" cy="98" rx="28" ry="7" />
        <rect x="1240" y="78" width="16" height="20" rx="2" />
      </g>
      <rect x="0" y="176" width="1600" height="4" fill="var(--color-rain-800)" opacity="0.6" />
    </svg>
  </div>
);
