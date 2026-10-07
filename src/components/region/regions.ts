/**
 * @file src/components/region/regions.ts
 * @desc The cup's five regions on the map: their ISO 3166-2 codes, their path data, the
 *       "Outside the PNW" choice, and the fill each region takes per state. Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { REGIONS } from "../../brand/identity.js";
import { PROVINCE_PATHS, STATE_PATHS } from "./regionPaths.js";

/** One of the cup's regions, by its full name. */
export type Region = (typeof REGIONS)[number];

/** The choice for players who live outside the five regions. */
export const OUTSIDE_PNW = "Outside the PNW" as const;

/** A region, or outside the PNW. */
export type RegionChoice = Region | typeof OUTSIDE_PNW;

/** Each region's ISO 3166-2 code, the key into the path data. */
export const REGION_ISO: Record<Region, string> = {
  Washington: "US-WA",
  Oregon: "US-OR",
  Idaho: "US-ID",
  "British Columbia": "CA-BC",
  Alaska: "US-AK",
};

const REGION_CODES = new Set(Object.values(REGION_ISO));

/**
 * @function regionPath
 * @param region {Region} a region
 * @returns {string} its SVG path data on the 480x360 map
 */
export const regionPath = (region: Region): string =>
  (STATE_PATHS[REGION_ISO[region]] ?? PROVINCE_PATHS[REGION_ISO[region]]) as string;

/** Every other state and province, drawn muted behind the regions. */
export const CONTEXT_PATHS: readonly (readonly [string, string])[] = [
  ...Object.entries(STATE_PATHS),
  ...Object.entries(PROVINCE_PATHS),
].filter(([iso]) => !REGION_CODES.has(iso));

/** How a region is drawn: idle, hovered or focused, highlighted or selected. */
export type RegionState = "idle" | "hover" | "on";

/** Fill, stroke and stroke width per state, as theme variables. */
export const REGION_LOOK: Record<RegionState, { fill: string; stroke: string; width: number }> = {
  idle: { fill: "var(--color-evergreen-500)", stroke: "var(--color-evergreen-200)", width: 0.9 },
  hover: { fill: "var(--color-evergreen-400)", stroke: "var(--color-evergreen-50)", width: 1.1 },
  on: { fill: "var(--color-evergreen-300)", stroke: "var(--color-evergreen-50)", width: 1.2 },
};

/** A muted look for regions a display map isn't highlighting. */
export const REGION_DIM = {
  fill: "var(--color-evergreen-700)",
  stroke: "var(--color-evergreen-500)",
  width: 0.7,
} as const;
