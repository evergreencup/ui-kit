/**
 * @file src/components/atmosphere/TreeLine.tsx
 * @desc A row of swaying conifer silhouettes along the bottom 45%: far (faint) or near
 *       (solid), seeded so SSR and the client agree. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { type CSSProperties, useId } from "react";
import { LAYER, parallaxStyle } from "./parallax.js";
import { coniferPoints, GROUND_Y, TREE_SEEDS, type TreeLayer, treeRow } from "./trees.js";

/** The row, density, seed and parallax depth. */
export type TreeLineProps = {
  layer: TreeLayer;
  density?: number | undefined;
  seed?: number | undefined;
  depth?: number | undefined;
};

const STOPS: Record<TreeLayer, readonly { offset: string; color: string; opacity: number }[]> = {
  near: [
    { offset: "0%", color: "#104726", opacity: 1 },
    { offset: "100%", color: "#051a0d", opacity: 1 },
  ],
  far: [
    { offset: "0%", color: "#0a301a", opacity: 0.55 },
    { offset: "100%", color: "#051a0d", opacity: 0.9 },
  ],
};

/**
 * @function TreeLine
 * @param props {TreeLineProps} layer, density (default 1), seed (default per layer) and depth
 *        (default 10 far, 18 near)
 * @returns {JSX.Element} the tree row layer, aria-hidden
 */
export const TreeLine = ({ layer, density = 1, seed, depth }: TreeLineProps) => {
  const id = useId();
  const trees = treeRow(layer, density, seed ?? TREE_SEEDS[layer]);
  return (
    <div
      aria-hidden
      className={`${LAYER} inset-x-0 bottom-0 h-[45%] w-full`}
      style={parallaxStyle(depth ?? (layer === "near" ? 18 : 10))}
    >
      <svg
        aria-hidden
        viewBox={`0 0 1600 ${GROUND_Y.toString()}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            {STOPS[layer].map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
            ))}
          </linearGradient>
        </defs>
        <g fill={`url(#${id})`}>
          {trees.map((t, i) => (
            <polygon
              // biome-ignore lint/suspicious/noArrayIndexKey: the row is a fixed, seeded sequence
              key={i}
              points={coniferPoints(t)}
              className={t.sway}
              style={
                {
                  "--sway-duration": t.duration,
                  "--sway-delay": t.delay,
                  transformBox: "fill-box",
                  transformOrigin: "center bottom",
                } as CSSProperties
              }
            />
          ))}
        </g>
        <rect x="0" y={GROUND_Y - 4} width="1600" height="6" fill="#051a0d" />
      </svg>
    </div>
  );
};
