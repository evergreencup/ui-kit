/**
 * @file tests/brand/colorMath.test.ts
 * @desc colorMath.ts: hex parsing, luminance, contrast and ink choice.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { contrastRatio, hexToRgb, INK, inkFor, luminance } from "../../src/brand/colorMath.js";

describe("colorMath", () => {
  it("parses long and short hex", () => {
    expect(hexToRgb("#49b86a")).toEqual([73, 184, 106]);
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
    expect(hexToRgb("000000")).toEqual([0, 0, 0]);
  });

  it("computes luminance across the linear and curved ranges", () => {
    expect(luminance("#000000")).toBe(0);
    expect(luminance("#ffffff")).toBeCloseTo(1);
    expect(luminance("#050505")).toBeCloseTo(0.0015, 3);
  });

  it("computes contrast in either order", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(21);
    expect(contrastRatio("#fff", "#000")).toBeCloseTo(21);
    expect(contrastRatio("#777", "#777")).toBe(1);
  });

  it("picks the ink with more contrast", () => {
    expect(inkFor("#eefaf1")).toBe(INK.dark);
    expect(inkFor("#051a0d")).toBe(INK.light);
  });
});
