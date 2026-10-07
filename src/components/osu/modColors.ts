/**
 * @file src/components/osu/modColors.ts
 * @desc Each mod bucket's pick color: a muted-but-distinct accent tuned for the dark palette,
 *       with a translucent tint for chip fills. Unknown mods fall back to NM's blue.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

/** The tournament's mod buckets, in pool order. */
export const MOD_BUCKETS = ["NM", "HD", "HR", "DT", "FM", "TB"] as const;

/** One mod bucket. */
export type ModBucket = (typeof MOD_BUCKETS)[number];

/** A mod's solid accent, its translucent fill, and the lighter ink its label takes on that fill. */
export type ModColor = { hex: string; tint: string; ink: string };

/** The pick colors: NM blue, HD yellow, HR red, DT purple, FM pink, TB teal. */
export const MOD_COLORS = {
  NM: { hex: "#5b9ad6", tint: "rgba(91, 154, 214, 0.14)", ink: "#9dc2e6" },
  HD: { hex: "#e3b53f", tint: "rgba(227, 181, 63, 0.14)", ink: "#eed38c" },
  HR: { hex: "#d96363", tint: "rgba(217, 99, 99, 0.14)", ink: "#e8a1a1" },
  DT: { hex: "#a486de", tint: "rgba(164, 134, 222, 0.14)", ink: "#c8b6eb" },
  FM: { hex: "#db83b6", tint: "rgba(219, 131, 182, 0.14)", ink: "#e9b5d3" },
  TB: { hex: "#4fbdac", tint: "rgba(79, 189, 172, 0.14)", ink: "#95d7cd" },
} as const satisfies Record<ModBucket, ModColor>;

/**
 * @function modColor
 * @param mod {string} a mod bucket abbreviation
 * @returns {ModColor} its pick color, NM's for anything unknown
 */
export const modColor = (mod: string): ModColor =>
  (MOD_COLORS as Record<string, ModColor>)[mod] ?? MOD_COLORS.NM;
