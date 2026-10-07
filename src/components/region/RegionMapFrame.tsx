/**
 * @file src/components/region/RegionMapFrame.tsx
 * @desc The map's shared SVG: the viewBox, a title, every non-region state and province muted
 *       behind, and the Alaska inset panel. RegionMap and RegionPicker draw their region paths
 *       inside it. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { type ReactNode, useId } from "react";
import { cx } from "../../utils/cx.js";
import { ALASKA_INSET, MAP_VIEW_HEIGHT, MAP_VIEW_WIDTH } from "./regionPaths.js";
import { CONTEXT_PATHS } from "./regions.js";

/**
 * @function RegionMapFrame
 * @param props {{ title: string; interactive?: boolean; className?: string; children: ReactNode }}
 *        the map's accessible title, whether it holds controls (a group, not one image), classes
 *        and the region paths
 * @returns {JSX.Element} the responsive SVG
 */
export const RegionMapFrame = ({
  title,
  interactive = false,
  className,
  children,
}: {
  title: string;
  interactive?: boolean | undefined;
  className?: string | undefined;
  children: ReactNode;
}) => {
  const titleId = useId();
  return (
    <svg
      viewBox={`0 0 ${MAP_VIEW_WIDTH.toString()} ${MAP_VIEW_HEIGHT.toString()}`}
      className={cx("h-auto w-full", className)}
      role={interactive ? "group" : "img"}
      aria-labelledby={titleId}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>{title}</title>
      {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: an SVG group is not focusable */}
      <g
        aria-hidden="true"
        fill="var(--color-evergreen-800)"
        stroke="var(--color-evergreen-600)"
        strokeWidth={0.5}
        strokeOpacity={0.6}
      >
        {CONTEXT_PATHS.map(([iso, d]) => (
          <path key={iso} d={d} />
        ))}
      </g>
      {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: an SVG group is not focusable */}
      <g aria-hidden="true">
        <rect
          x={ALASKA_INSET.x}
          y={ALASKA_INSET.y}
          width={ALASKA_INSET.width}
          height={ALASKA_INSET.height}
          rx={4}
          fill="var(--color-evergreen-950)"
          stroke="var(--color-evergreen-700)"
          strokeWidth={0.8}
          strokeOpacity={0.7}
        />
        <text
          x={ALASKA_INSET.x + 8}
          y={ALASKA_INSET.y + 15}
          fill="var(--color-fog-500)"
          fontSize={9}
          fontWeight={600}
          letterSpacing={2}
        >
          ALASKA
        </text>
      </g>
      {children}
    </svg>
  );
};
