/**
 * @file src/components/atmosphere/parallax.ts
 * @desc The parallax contract every atmosphere layer shares: the `parallax-layer` class plus a
 *       --parallax-factor (its depth) that a ParallaxScope parent's --px/--py multiply.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { CSSProperties } from "react";

/** The classes on every atmosphere layer. */
export const LAYER = "parallax-layer pointer-events-none absolute";

/**
 * @function parallaxStyle
 * @param depth {number} how far the layer moves with the pointer (0 is fixed; bigger is nearer)
 * @param extra {CSSProperties} the layer's other inline styles
 * @returns {CSSProperties} the style with --parallax-factor set
 */
export const parallaxStyle = (depth: number, extra: CSSProperties = {}): CSSProperties =>
  ({ "--parallax-factor": depth, ...extra }) as CSSProperties;
