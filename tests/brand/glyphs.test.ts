/**
 * @file tests/brand/glyphs.test.ts
 * @desc glyphs.ts: the favicon SVG and the sprig data URI.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { CONIFER_PATH, faviconSvg, SPRIG, sprigDataUri } from "../../src/brand/glyphs.js";

describe("faviconSvg", () => {
  it("draws the tile, crown and trunk in the brand colors by default", () => {
    const svg = faviconSvg();
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 32 32"/);
    expect(svg).toContain('fill="#051a0d"');
    expect(svg).toContain(`<path d="${CONIFER_PATH}" fill="#49b86a"/>`);
    expect(svg).toContain('fill="#6b4423"');
    expect(svg.endsWith("</svg>")).toBe(true);
  });

  it("takes color overrides", () => {
    const svg = faviconSvg({ background: "#000", crown: "#111", trunk: "#222" });
    expect(svg).toContain('fill="#000"');
    expect(svg).toContain('fill="#111"');
    expect(svg).toContain('fill="#222"');
  });
});

describe("sprigDataUri", () => {
  it("encodes one sprig tile as a CSS url", () => {
    const uri = sprigDataUri();
    expect(uri.startsWith('url("data:image/svg+xml;utf8,')).toBe(true);
    const svg = decodeURIComponent(uri.slice(29, -2));
    expect(svg).toContain(`points='${SPRIG.points}'`);
    expect(svg).toContain("fill='#104726'");
    expect(decodeURIComponent(sprigDataUri("#abcdef"))).toContain("fill='#abcdef'");
  });
});
