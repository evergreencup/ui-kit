/**
 * @file tests/utils/utils.test.ts
 * @desc cx, random, format, href and slug: the pure helpers.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import { cx } from "../../src/utils/cx.js";
import { formatMmSs, formatUsd, padCount, percentOf, plural } from "../../src/utils/format.js";
import { isExternalHref } from "../../src/utils/href.js";
import { mulberry32, randRange } from "../../src/utils/random.js";
import { slugify } from "../../src/utils/slug.js";

describe("cx", () => {
  it("drops falsy values and lets later palette classes win", () => {
    expect(cx("a", false, null, undefined, 0, "b")).toBe("a b");
    expect(cx("text-evergreen-50", "text-fog-300")).toBe("text-fog-300");
    expect(cx("text-sm", "text-evergreen-50")).toBe("text-sm text-evergreen-50");
    expect(cx("p-5", "p-3")).toBe("p-3");
  });
});

describe("random", () => {
  it("is deterministic per seed and stays in range", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const values = Array.from({ length: 50 }, () => a());
    expect(values).toEqual(Array.from({ length: 50 }, () => b()));
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
    const r = randRange(mulberry32(1), 10, 20);
    expect(r).toBeGreaterThanOrEqual(10);
    expect(r).toBeLessThan(20);
  });
});

describe("format", () => {
  it("formats whole dollars", () => {
    expect(formatUsd(0)).toBe("$0");
    expect(formatUsd(125_049)).toBe("$1,250");
  });

  it("formats m:ss, flooring and clamping", () => {
    expect(formatMmSs(95)).toBe("1:35");
    expect(formatMmSs(142.9)).toBe("2:22");
    expect(formatMmSs(-4)).toBe("0:00");
  });

  it("counts nouns, pads counters and clamps percentages", () => {
    expect(plural(1, "hour")).toBe("1 hour");
    expect(plural(3, "hour")).toBe("3 hours");
    expect(plural(2, "person", "people")).toBe("2 people");
    expect(padCount(7)).toBe("007");
    expect(padCount(7, 2)).toBe("07");
    expect(percentOf(50, 200)).toBe(25);
    expect(percentOf(500, 200)).toBe(100);
    expect(percentOf(-5, 200)).toBe(0);
    expect(percentOf(5, 0)).toBe(0);
  });
});

describe("isExternalHref", () => {
  it("spots schemes and protocol-relative URLs", () => {
    for (const h of ["https://x.y", "mailto:a@b.c", "//cdn.x"])
      expect(isExternalHref(h)).toBe(true);
    for (const h of ["/rules", "#top", "rules", "?q=1"]) expect(isExternalHref(h)).toBe(false);
  });
});

describe("slugify", () => {
  it("makes kebab-case anchors", () => {
    expect(slugify("Photography & recording")).toBe("photography-and-recording");
    expect(slugify("  What's next?  ")).toBe("what-s-next");
  });
});
