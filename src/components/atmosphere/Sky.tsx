/**
 * @file src/components/atmosphere/Sky.tsx
 * @desc The backmost layer: a vertical gradient from a tint down to Pitch, with sparse seeded
 *       pinpoint stars in the top 55%. Deterministic, so SSR and the client agree. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { mulberry32, randRange } from "../../utils/random.js";
import { LAYER, parallaxStyle } from "./parallax.js";

/** Gradient stops, star count, PRNG seed and parallax depth. */
export type SkyProps = {
  tintTop?: string | undefined;
  tintMid?: string | undefined;
  stars?: number | undefined;
  seed?: number | undefined;
  depth?: number | undefined;
};

/**
 * @function Sky
 * @param props {SkyProps} tintTop (default cascade-900), tintMid (default evergreen-950), stars
 *        (default 20), seed (default 9124) and depth (default 2)
 * @returns {JSX.Element} the sky layer, aria-hidden
 */
export const Sky = ({
  tintTop = "var(--color-cascade-900)",
  tintMid = "var(--color-evergreen-950)",
  stars = 20,
  seed = 9124,
  depth = 2,
}: SkyProps) => {
  const gen = mulberry32(seed);
  const dots = Array.from({ length: stars }, (_, id) => ({
    id,
    left: randRange(gen, 0, 100),
    top: randRange(gen, 0, 55),
    size: randRange(gen, 0.8, 1.9),
    opacity: randRange(gen, 0.15, 0.35),
  }));
  return (
    <div aria-hidden className={`${LAYER} inset-0`} style={parallaxStyle(depth)}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${tintTop}, ${tintMid} 65%, var(--color-evergreen-950) 100%)`,
        }}
      />
      {dots.map((d) => (
        <span
          key={d.id}
          data-star=""
          className="absolute rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.35)]"
          style={{
            left: `${d.left.toString()}%`,
            top: `${d.top.toString()}%`,
            width: `${d.size.toString()}px`,
            height: `${d.size.toString()}px`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
};
