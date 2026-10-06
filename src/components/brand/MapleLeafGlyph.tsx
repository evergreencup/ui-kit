/**
 * @file src/components/brand/MapleLeafGlyph.tsx
 * @desc The maple leaf, in currentColor at 78% opacity. Decorative. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { MAPLE_LEAF } from "../../brand/glyphs.js";

/**
 * @function MapleLeafGlyph
 * @param props {Omit<ComponentProps<"svg">, "children">} svg props (size and color via className)
 * @returns {JSX.Element} the leaf, aria-hidden
 */
export const MapleLeafGlyph = (props: Omit<ComponentProps<"svg">, "children">) => (
  <svg viewBox={MAPLE_LEAF.viewBox} aria-hidden {...props}>
    <path d={MAPLE_LEAF.path} fill="currentColor" opacity="0.78" />
  </svg>
);
