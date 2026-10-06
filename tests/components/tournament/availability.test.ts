/**
 * @file tests/components/tournament/availability.test.ts
 * @desc availability.ts: slot ids, ranges, toggles, drags, overlap and summaries.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { describe, expect, it } from "vitest";
import {
  applyIds,
  fullOverlap,
  HOURS,
  overlapLevels,
  rangeIds,
  slotId,
  summarizeAvailability,
  toggleIds,
} from "../../../src/components/tournament/availability.js";

describe("availability", () => {
  it("formats ids and hours", () => {
    expect(slotId("sat", 4)).toBe("sat-04");
    expect(HOURS).toHaveLength(24);
    expect(HOURS[23]).toBe("23");
  });

  it("spans a rectangle in either direction", () => {
    expect(rangeIds({ day: "sat", hour: 2 }, { day: "fri", hour: 1 })).toEqual([
      "fri-01",
      "fri-02",
      "sat-01",
      "sat-02",
    ]);
    expect(rangeIds({ day: "sun", hour: 5 }, { day: "sun", hour: 5 })).toEqual(["sun-05"]);
  });

  it("toggles a whole group on, then off", () => {
    const on = toggleIds(["fri-00"], ["fri-00", "fri-01"]);
    expect(on.sort()).toEqual(["fri-00", "fri-01"]);
    expect(toggleIds(on, ["fri-00", "fri-01"])).toEqual([]);
  });

  it("adds or removes a drag's slots", () => {
    expect(applyIds(["a"], ["b"], "add")).toEqual(["a", "b"]);
    expect(applyIds(["a", "b"], ["a"], "remove")).toEqual(["b"]);
  });

  it("counts overlap, ignoring a member's duplicates, and finds full overlap", () => {
    const sets = [["fri-00", "fri-00", "fri-01"], ["fri-00"]];
    expect(overlapLevels(sets)).toEqual({ "fri-00": 2, "fri-01": 1 });
    expect(fullOverlap(sets)).toEqual(["fri-00"]);
    expect(fullOverlap([])).toEqual([]);
  });

  it("summarizes runs per day", () => {
    expect(summarizeAvailability([])).toBe("No hours picked");
    expect(
      summarizeAvailability(["sat-03", "fri-18", "fri-19", "fri-20", "fri-23", "sat-00"]),
    ).toBe("Fri 18–20, 23 · Sat 00, 03");
  });
});
