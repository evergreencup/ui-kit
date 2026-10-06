/**
 * @file tests/brand/brandText.test.ts
 * @desc brandText.ts: the plain-text kit carries the type, every palette step and the tokens.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { brandText } from "../../src/brand/brandText.js";
import { PALETTE, PALETTE_ORDER, SEMANTIC_TOKENS } from "../../src/brand/palette.js";

describe("brandText", () => {
  const text = brandText();

  it("opens with the title and domain and ends with a newline", () => {
    expect(text.startsWith("EVERGREEN CUP: BRAND KIT\nevergreencup.org\n")).toBe(true);
    expect(text.endsWith("\n")).toBe(true);
  });

  it("lists the three families with weights", () => {
    expect(text).toContain("Display: Big Shoulders Display");
    expect(text).toContain("Sans: Geist\n");
    expect(text).toContain("Mono: Geist Mono");
    expect(text).toContain("Weights: 700, 800, 900.");
  });

  it("lists every palette step and semantic token", () => {
    for (const name of PALETTE_ORDER) {
      for (const [step, hex] of Object.entries(PALETTE[name]))
        expect(text).toContain(`  ${step.padEnd(4)}  ${hex}`);
    }
    for (const t of SEMANTIC_TOKENS)
      expect(text).toContain(`${t.token.padEnd(18)}  ${t.hex}  ${t.usage}`);
  });
});
