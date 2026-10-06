/**
 * @file tests/theme.test.ts
 * @desc theme.css against the brand data: every palette hex and semantic surface matches
 *       palette.ts, and the text tokens clear WCAG AA on the page and the surfaces.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "../src/brand/colorMath.js";
import { PALETTE, PALETTE_ORDER, SEMANTIC_TOKENS } from "../src/brand/palette.js";

const css = readFileSync(join(process.cwd(), "src/theme.css"), "utf8");
const cssVar = (name: string): string | undefined =>
  new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, "i").exec(css)?.[1];

describe("theme.css", () => {
  it("defines every palette step with the hex in palette.ts", () => {
    for (const name of PALETTE_ORDER) {
      for (const [step, hex] of Object.entries(PALETTE[name])) {
        expect(cssVar(`${name}-${step}`), `${name}-${step}`).toBe(hex);
      }
    }
  });

  it("has no palette step palette.ts doesn't know", () => {
    const steps = [...css.matchAll(/--color-([a-z]+)-(\d+):/g)].map((m) => `${m[1]}-${m[2]}`);
    const known = PALETTE_ORDER.flatMap((n) => Object.keys(PALETTE[n]).map((s) => `${n}-${s}`));
    expect(steps.sort()).toEqual(known.sort());
  });

  it("gives the two literal surfaces the hexes the brand data lists", () => {
    for (const token of ["surface", "surface-elevated"]) {
      expect(cssVar(token)).toBe(SEMANTIC_TOKENS.find((t) => t.token === token)?.hex);
    }
  });

  it("keeps body, muted and accent text at 4.5:1 or better on the page and surfaces", () => {
    const backgrounds = ["background", "surface", "surface-elevated"].map(
      (t) => SEMANTIC_TOKENS.find((s) => s.token === t)?.hex as string,
    );
    for (const text of ["foreground", "muted", "accent"]) {
      const hex = SEMANTIC_TOKENS.find((s) => s.token === text)?.hex as string;
      for (const bg of backgrounds) expect(contrastRatio(hex, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("ships the source line, the coarse variant and the reduced-motion rule", () => {
    expect(css).toContain('@source "./";');
    expect(css).toContain("@custom-variant coarse (@media (pointer: coarse));");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
