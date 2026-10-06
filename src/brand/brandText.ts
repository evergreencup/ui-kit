/**
 * @file src/brand/brandText.ts
 * @desc The plain-text brand kit: type, every palette and the semantic tokens, for a designer
 *       handoff route (`return new Response(brandText())`). Built from the brand data, so it can't
 *       drift from the brand page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { BRAND, FONTS } from "./identity.js";
import { PALETTE_INFO, PALETTE_ORDER, SEMANTIC_TOKENS, swatches } from "./palette.js";

const RULE = "-".repeat(40);

const heading = (title: string): string[] => [RULE, title, RULE, ""];

const fontBlock = (): string[] =>
  FONTS.flatMap((f) => [
    `${f.role[0]?.toUpperCase()}${f.role.slice(1)}: ${f.family}`,
    `  ${f.notes}`,
    `  Weights: ${f.weights.join(", ")}.`,
    "",
  ]);

const paletteBlock = (): string =>
  PALETTE_ORDER.map((name) => {
    const rows = swatches(name).map((s) => `  ${s.step.padEnd(4)}  ${s.hex}`);
    return [`${PALETTE_INFO[name].label}: ${PALETTE_INFO[name].description}`, ...rows].join("\n");
  }).join("\n\n");

/**
 * @function brandText
 * @returns {string} the whole brand kit as plain text, ending in a newline
 */
export const brandText = (): string =>
  [
    `${BRAND.name.toUpperCase()}: BRAND KIT`,
    BRAND.domain,
    "",
    ...heading("TYPOGRAPHY"),
    ...fontBlock(),
    ...heading("COLOR PALETTE"),
    paletteBlock(),
    "",
    ...heading("SURFACES & TEXT"),
    ...SEMANTIC_TOKENS.map((s) => `  ${s.token.padEnd(18)}  ${s.hex}  ${s.usage}`),
    "",
  ].join("\n");
