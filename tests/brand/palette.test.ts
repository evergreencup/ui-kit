/**
 * @file tests/brand/palette.test.ts
 * @desc palette.ts: swatches order and ink, and the core and semantic colors resolving to
 *       palette steps.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { INK } from "../../src/brand/colorMath.js";
import {
  CORE_COLORS,
  PALETTE,
  PALETTE_INFO,
  PALETTE_ORDER,
  SEMANTIC_TOKENS,
  swatches,
} from "../../src/brand/palette.js";

describe("swatches", () => {
  it("lists a palette lightest first with tokens and readable ink", () => {
    const list = swatches("evergreen");
    expect(list.map((s) => s.step)).toEqual([
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ]);
    expect(list[0]).toEqual({ token: "evergreen-50", step: "50", hex: "#eefaf1", ink: INK.dark });
    expect(list.at(-1)?.ink).toBe(INK.light);
  });

  it("covers every palette in order with a label and description", () => {
    expect(PALETTE_ORDER).toEqual(Object.keys(PALETTE));
    for (const name of PALETTE_ORDER) {
      expect(PALETTE_INFO[name].label.toLowerCase()).toBe(name);
      expect(PALETTE_INFO[name].description.length).toBeGreaterThan(10);
      expect(swatches(name).length).toBe(Object.keys(PALETTE[name]).length);
    }
  });
});

describe("brand colors", () => {
  it("points every core and palette-backed semantic token at its palette hex", () => {
    for (const c of [...CORE_COLORS, ...SEMANTIC_TOKENS]) {
      const [name, step] = c.token.split("-") as [keyof typeof PALETTE, string];
      const fromPalette = (PALETTE[name] as Record<string, string> | undefined)?.[step];
      if (fromPalette) expect(c.hex, c.token).toBe(fromPalette);
    }
    expect(CORE_COLORS.map((c) => c.name)).toEqual([
      "Mist",
      "Evergreen",
      "Cascade",
      "Bark",
      "Pitch",
    ]);
  });
});
