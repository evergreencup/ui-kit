/**
 * @file src/components/atmosphere/MistBand.tsx
 * @desc A horizontal mist strip: two blurred radial washes that drift sideways. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { LAYER, parallaxStyle } from "./parallax.js";

/** Vertical position and height (CSS lengths), alpha, tint, depth and whether it drifts. */
export type MistBandProps = {
  top: string;
  height: string;
  opacity?: number | undefined;
  tint?: string | undefined;
  depth?: number | undefined;
  animate?: boolean | undefined;
};

/**
 * @function MistBand
 * @param props {MistBandProps} top, height, opacity (default 0.15), tint (default fog-300), depth
 *        (default 7) and animate (default true)
 * @returns {JSX.Element} the mist layer, aria-hidden
 */
export const MistBand = ({
  top,
  height,
  opacity = 0.15,
  tint = "var(--color-fog-300)",
  depth = 7,
  animate = true,
}: MistBandProps) => (
  <div
    aria-hidden
    className={`${LAYER} inset-x-0`}
    style={parallaxStyle(depth, { top, height, opacity })}
  >
    <div
      className={`absolute inset-0 blur-[18px] ${animate ? "mist-drift" : ""}`}
      style={{
        background: `radial-gradient(ellipse at 20% 50%, ${tint} 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, ${tint} 0%, transparent 55%)`,
      }}
    />
  </div>
);
