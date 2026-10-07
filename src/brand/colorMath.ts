/**
 * @file src/brand/colorMath.ts
 * @desc WCAG color math on hex strings: relative luminance, contrast ratio, and which brand ink
 *       (Pitch or Fog, else black or white) reads at AA on a background. Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

/** The two brand inks text takes on a swatch: Pitch (evergreen-950) and Fog (fog-100). */
export const INK = { dark: "#051a0d", light: "#edf2f4" } as const;

/** Black and white, for the mid-tones where neither brand ink reaches 4.5:1. */
export const INK_FALLBACK = { dark: "#000000", light: "#ffffff" } as const;

/** WCAG AA for normal-size text. */
export const AA_TEXT = 4.5;

const better = (background: string, ink: { dark: string; light: string }): string =>
  contrastRatio(background, ink.dark) >= contrastRatio(background, ink.light)
    ? ink.dark
    : ink.light;

/**
 * @function hexToRgb
 * @param hex {string} a `#rrggbb` or `#rgb` color
 * @returns {[number, number, number]} the red, green and blue channels, 0 to 255
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? [...raw].map((c) => c + c).join("") : raw;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const channel = (c: number): number => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

/**
 * @function luminance
 * @param hex {string} a hex color
 * @returns {number} its WCAG relative luminance, 0 (black) to 1 (white)
 */
export const luminance = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/**
 * @function contrastRatio
 * @param a {string} a hex color
 * @param b {string} another hex color
 * @returns {number} the WCAG contrast ratio between them, 1 to 21, order-independent
 */
export const contrastRatio = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * @function inkFor
 * @param background {string} a hex background
 * @returns {string} INK.dark or INK.light, whichever has the higher contrast on it; when that
 *          one is under 4.5:1, black or white instead
 */
export const inkFor = (background: string): string => {
  const ink = better(background, INK);
  return contrastRatio(background, ink) >= AA_TEXT ? ink : better(background, INK_FALLBACK);
};
