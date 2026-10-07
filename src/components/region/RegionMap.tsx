/**
 * @file src/components/region/RegionMap.tsx
 * @desc The PNW region map for display: the five regions over the muted continent, the
 *       highlighted ones lit and the rest dimmed (all lit when none are given). Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { REGIONS } from "../../brand/identity.js";
import { RegionMapFrame } from "./RegionMapFrame.js";
import { REGION_DIM, REGION_LOOK, type Region, regionPath } from "./regions.js";

/** Which regions to light, the accessible title and classes. */
export type RegionMapProps = {
  /** Regions to light up; the others dim. Empty or missing lights all five. */
  highlight?: readonly Region[] | undefined;
  title?: string | undefined;
  className?: string | undefined;
};

/**
 * @function RegionMap
 * @param props {RegionMapProps} highlight, title (default names the lit regions) and className
 * @returns {JSX.Element} the map as one labeled image
 */
export const RegionMap = ({ highlight = [], title, className }: RegionMapProps) => {
  const lit = (r: Region) => highlight.length === 0 || highlight.includes(r);
  const names = REGIONS.filter(lit).join(", ");
  return (
    <RegionMapFrame title={title ?? `Map of the Pacific Northwest: ${names}`} className={className}>
      {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: an SVG group is not focusable */}
      <g aria-hidden="true">
        {REGIONS.map((r) => {
          const look = lit(r) ? REGION_LOOK.on : REGION_DIM;
          return (
            <path
              key={r}
              d={regionPath(r)}
              data-region={r}
              data-lit={lit(r)}
              fill={look.fill}
              stroke={look.stroke}
              strokeWidth={look.width}
            />
          );
        })}
      </g>
    </RegionMapFrame>
  );
};
