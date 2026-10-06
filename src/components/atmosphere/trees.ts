/**
 * @file src/components/atmosphere/trees.ts
 * @desc TreeLine's pure geometry: the far and near base rows, density thinning and filling with a
 *       seeded generator, per-tree sway timing, and the 11-point conifer polygon.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { mulberry32, randRange } from "../../utils/random.js";

/** The two rows: far is short and faint, near is tall and solid. */
export type TreeLayer = "far" | "near";

/** One tree: its center x, height and width on the 1600x360 canvas. */
export type Tree = { x: number; h: number; w: number };

/** A placed tree with its sway animation timing. */
export type PlacedTree = Tree & {
  duration: string;
  delay: string;
  sway: "sway-left" | "sway-right";
};

const BASE: Record<TreeLayer, readonly Tree[]> = {
  far: [
    { x: 80, h: 160, w: 120 },
    { x: 260, h: 200, w: 140 },
    { x: 440, h: 170, w: 130 },
    { x: 620, h: 210, w: 150 },
    { x: 820, h: 150, w: 110 },
    { x: 1000, h: 190, w: 140 },
    { x: 1180, h: 170, w: 130 },
    { x: 1360, h: 210, w: 150 },
    { x: 1540, h: 160, w: 120 },
  ],
  near: [
    { x: 40, h: 260, w: 170 },
    { x: 220, h: 300, w: 200 },
    { x: 430, h: 240, w: 160 },
    { x: 640, h: 320, w: 210 },
    { x: 860, h: 260, w: 180 },
    { x: 1080, h: 300, w: 200 },
    { x: 1300, h: 250, w: 170 },
    { x: 1520, h: 290, w: 190 },
  ],
};

/** The default seed per row. */
export const TREE_SEEDS: Record<TreeLayer, number> = { far: 419, near: 731 };

/** The canvas floor every tree stands on. */
export const GROUND_Y = 360;

/**
 * @function treeRow
 * @param layer {TreeLayer} which row
 * @param density {number} below 1 thins the row by coin flip; above 1 adds jittered copies of the
 *        first (density - 1) share of trees
 * @param seed {number} the PRNG seed
 * @returns {PlacedTree[]} the row's trees with sway timing, the same for the same inputs
 */
export const treeRow = (layer: TreeLayer, density: number, seed: number): PlacedTree[] => {
  const gen = mulberry32(seed);
  const base = BASE[layer];
  const kept = density >= 1 ? [...base] : base.filter(() => gen() < density);
  const extra =
    density > 1
      ? base.slice(0, Math.floor(base.length * (density - 1))).map((t) => ({
          x: t.x + randRange(gen, -60, 60),
          h: t.h * randRange(gen, 0.85, 1.05),
          w: t.w * randRange(gen, 0.85, 1.05),
        }))
      : [];
  return [...kept, ...extra].map((t, i) => ({
    ...t,
    duration: `${randRange(gen, 5, 9).toFixed(2)}s`,
    delay: `${randRange(gen, 0, 4).toFixed(2)}s`,
    sway: i % 2 === 0 ? "sway-left" : "sway-right",
  }));
};

/**
 * @function coniferPoints
 * @param tree {Tree} the tree's x, height and width
 * @returns {string} an SVG polygon `points` value: a three-tier conifer standing on GROUND_Y
 */
export const coniferPoints = ({ x, h, w }: Tree): string => {
  const half = w / 2;
  const tip = GROUND_Y - h;
  const midTop = tip + h * 0.35;
  const midBottom = tip + h * 0.7;
  const pts: [number, number][] = [
    [x, tip],
    [x + half * 0.65, midTop],
    [x + half * 0.3, midTop],
    [x + half * 0.85, midBottom],
    [x + half * 0.45, midBottom],
    [x + half, GROUND_Y],
    [x - half, GROUND_Y],
    [x - half * 0.45, midBottom],
    [x - half * 0.85, midBottom],
    [x - half * 0.3, midTop],
    [x - half * 0.65, midTop],
  ];
  return pts.map(([px, py]) => `${px.toString()},${py.toString()}`).join(" ");
};
