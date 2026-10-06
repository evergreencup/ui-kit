/**
 * @file tests/site/egc.test.ts
 * @desc The EGC site data: nav building, insertion, social overrides.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import {
  CTA_NAV,
  FOOTER_COLUMNS,
  insertBefore,
  MAIN_NAV,
  mainNav,
  SOCIALS,
  withHref,
} from "../../src/site/egc.js";

describe("site data", () => {
  it("adds Soundtrack before Donate only when live", () => {
    expect(mainNav()).toBe(MAIN_NAV);
    const live = mainNav({ soundtrack: true }).map((i) => i.label);
    expect(live.slice(-2)).toEqual(["Soundtrack", "Donate"]);
  });

  it("appends when the anchor entry is missing", () => {
    expect(insertBefore([], "/x", CTA_NAV)).toEqual([CTA_NAV]);
  });

  it("overrides one social's href, ignoring empty values", () => {
    const set = withHref(SOCIALS, "osu! forum", "https://osu.ppy.sh/community/forums/topics/1");
    expect(set.find((s) => s.name === "osu! forum")?.href).toContain("forums");
    expect(withHref(SOCIALS, "Discord", null)).toEqual(SOCIALS);
  });

  it("has five footer columns with unique hrefs per column", () => {
    expect(FOOTER_COLUMNS.map((c) => c.title)).toEqual([
      "Tournament",
      "Community",
      "Support",
      "About",
      "Legal",
    ]);
    for (const c of FOOTER_COLUMNS)
      expect(new Set(c.items.map((i) => i.href)).size).toBe(c.items.length);
  });
});
