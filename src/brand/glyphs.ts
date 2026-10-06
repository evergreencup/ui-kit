/**
 * @file src/brand/glyphs.ts
 * @desc The brand's vector marks as data: the conifer glyph (crown path + trunk rect, 32x32), the
 *       maple leaf, the footer sprig, and builders for the favicon SVG and the sprig strip's data
 *       URI. Components and the favicon both draw from these so the marks never drift apart.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { PALETTE } from "./palette.js";

/** The conifer crown on a 32x32 box. */
export const CONIFER_PATH =
  "M16 2 L22 10 L19 10 L24 17 L21 17 L26 24 L6 24 L11 17 L8 17 L13 10 L10 10 Z";

/** The conifer trunk under the crown. */
export const CONIFER_TRUNK = { x: 14.5, y: 24, width: 3, height: 5, rx: 0.5 } as const;

/** The maple leaf, drawn on its own wide viewBox. */
export const MAPLE_LEAF = {
  viewBox: "-2015 -2000 4030 4030",
  path: "m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z",
} as const;

/** The footer sprig: one small conifer on a 48x12 tile. */
export const SPRIG = {
  width: 48,
  height: 12,
  points: "24,0 28,4 26,4 30,8 28,8 32,12 16,12 20,8 18,8 22,4 20,4",
} as const;

/** Colors for {@link faviconSvg}. */
export type FaviconColors = { background?: string; crown?: string; trunk?: string };

/**
 * @function faviconSvg
 * @param colors {FaviconColors} optional overrides (default Pitch tile, evergreen-400 crown,
 *        bark-500 trunk)
 * @returns {string} the 32x32 rounded-tile favicon as SVG markup, for `app/icon.svg`
 */
export const faviconSvg = ({
  background = PALETTE.evergreen["950"],
  crown = PALETTE.evergreen["400"],
  trunk = PALETTE.bark["500"],
}: FaviconColors = {}): string => {
  const t = CONIFER_TRUNK;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">',
    `<rect width="32" height="32" rx="7" fill="${background}"/>`,
    `<path d="${CONIFER_PATH}" fill="${crown}"/>`,
    `<rect x="${t.x}" y="${t.y}" width="${t.width}" height="${t.height}" rx="${t.rx}" fill="${trunk}"/>`,
    "</svg>",
  ].join("");
};

/**
 * @function sprigDataUri
 * @param fill {string} the sprig's color (default evergreen-800)
 * @returns {string} a CSS `url(...)` of one sprig tile, for a repeat-x background
 */
export const sprigDataUri = (fill: string = PALETTE.evergreen["800"]): string =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${SPRIG.width}' height='${SPRIG.height}' viewBox='0 0 ${SPRIG.width} ${SPRIG.height}'><polygon points='${SPRIG.points}' fill='${fill}'/></svg>`,
  )}")`;
