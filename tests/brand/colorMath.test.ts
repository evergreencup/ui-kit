/**
 * @file tests/brand/colorMath.test.ts
 * @desc colorMath.ts: hex parsing, luminance, contrast and ink choice.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { describe, expect, it } from "vitest";
import {
  AA_TEXT,
  contrastRatio,
  hexToRgb,
  INK,
  INK_FALLBACK,
  inkFor,
  luminance,
} from "../../src/brand/colorMath.js";

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

  it("falls back to black or white on mid-tones the brand inks miss", () => {
    for (const hex of ["#8e6738", "#667579"]) {
      expect(inkFor(hex)).toBe(INK_FALLBACK.light);
      expect(contrastRatio(hex, inkFor(hex))).toBeGreaterThanOrEqual(AA_TEXT);
    }
    expect(inkFor("#7a7a7a")).toBe(INK_FALLBACK.dark);
  });
});
