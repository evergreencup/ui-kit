/**
 * @file src/brand/identity.ts
 * @desc Who the Evergreen Cup is, as data: names, taglines, the legal line, the regions it
 *       serves, and the three type families with the job each does. Components read these for
 *       their default copy so the wording lives in one place.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** The cup's names and fixed lines. */
export const BRAND = {
  name: "Evergreen Cup",
  short: "EGC",
  domain: "evergreencup.org",
  url: "https://evergreencup.org",
  kicker: "Pacific Northwest osu! LAN",
  tagline: "A Pacific Northwest osu! LAN. Built by the community, for the community.",
  description: "Evergreen Cup, a Pacific Northwest osu! LAN tournament.",
  legal: "Not affiliated with osu! or ppy Pty Ltd.",
} as const;

/** The regions the cup draws from, in footer order. */
export const REGIONS = ["Washington", "Oregon", "Idaho", "British Columbia", "Alaska"] as const;

/** What a type family is for. */
export type FontRole = "display" | "sans" | "mono";

/** One brand type family: its name, role, the weights in use, a sample and usage notes. */
export type BrandFont = {
  role: FontRole;
  family: string;
  weights: readonly number[];
  sample: string;
  notes: string;
};

/** The three families, display first. */
export const FONTS: readonly BrandFont[] = [
  {
    role: "display",
    family: "Big Shoulders Display",
    weights: [700, 800, 900],
    sample: "Evergreen Cup",
    notes: "Hero titles and section headers. Bold, slightly condensed, runs tight.",
  },
  {
    role: "sans",
    family: "Geist",
    weights: [400, 500, 600, 700],
    sample: "The cascades hold the rain. The forest holds the line.",
    notes: "Everything else: paragraphs, UI labels, navigation.",
  },
  {
    role: "mono",
    family: "Geist Mono",
    weights: [400, 500],
    sample: "00759c · 49b86a · 6b4423",
    notes: "Numbers, scores, timestamps, hex codes. Never used for paragraphs.",
  },
];
