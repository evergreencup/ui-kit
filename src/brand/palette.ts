/**
 * @file src/brand/palette.ts
 * @desc The Evergreen Cup palette as data: every step of the six palettes, the five committed
 *       core colors, and the semantic tokens. The single source for the brand page, the plain-text
 *       handoff and any code that needs a hex; theme.css mirrors it (tests/theme.test.ts).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { inkFor } from "./colorMath.js";

/** The six palette families, in brand-page order. */
export type PaletteName = "evergreen" | "cascade" | "bark" | "moss" | "fog" | "rain";

/** The steps of every palette, keyed by name then step ("50" ... "950"). */
export const PALETTE = {
  evergreen: {
    "50": "#eefaf1",
    "100": "#d5f2de",
    "200": "#aee5bd",
    "300": "#7cd293",
    "400": "#49b86a",
    "500": "#2a9b50",
    "600": "#1d7c3f",
    "700": "#165f33",
    "800": "#104726",
    "900": "#0a301a",
    "950": "#051a0d",
  },
  cascade: {
    "50": "#eef6fa",
    "100": "#d5e8f1",
    "200": "#a6cfe0",
    "300": "#6fb2ce",
    "400": "#3e92b8",
    "500": "#00759c",
    "600": "#005e7e",
    "700": "#004861",
    "800": "#033246",
    "900": "#021e2c",
    "950": "#011320",
  },
  bark: {
    "50": "#f3e9db",
    "100": "#e3cdad",
    "200": "#c9a984",
    "300": "#ab885e",
    "400": "#8e6738",
    "500": "#6b4423",
    "700": "#3f2812",
    "800": "#2c1b0c",
    "900": "#1e1208",
    "950": "#120a04",
  },
  moss: { "300": "#a9bb96", "400": "#8fa579", "600": "#5c7446", "900": "#1e2916" },
  fog: {
    "100": "#edf2f4",
    "200": "#d5dde1",
    "300": "#bcc8cd",
    "400": "#9dacb0",
    "500": "#7f9094",
    "600": "#667579",
    "700": "#4d5a5e",
    "800": "#354042",
    "900": "#212a2c",
    "950": "#131a1b",
  },
  rain: { "400": "#6d8da0", "600": "#3e5a70", "800": "#21323f" },
} as const satisfies Record<PaletteName, Record<string, string>>;

/** The palettes in brand-page order. */
export const PALETTE_ORDER: readonly PaletteName[] = [
  "evergreen",
  "cascade",
  "bark",
  "moss",
  "fog",
  "rain",
];

/** Each palette's display name and one-line description. */
export const PALETTE_INFO: Record<PaletteName, { label: string; description: string }> = {
  evergreen: {
    label: "Evergreen",
    description: "Deep forest green. The brand's anchor, the green you'll see most.",
  },
  cascade: {
    label: "Cascade",
    description: "Overcast-sky blue. Pairs with Evergreen for the Doug Flag two-tone.",
  },
  bark: {
    label: "Bark",
    description: "Warm wood. Earthy accents and texture that doesn't lean green.",
  },
  moss: {
    label: "Moss",
    description: "Lichen and undergrowth. Organic accents in atmosphere art.",
  },
  fog: { label: "Fog", description: "Pale grey-blue. The color of body text and subdued labels." },
  rain: {
    label: "Rain",
    description: "Cool grey-blue. Rain streaks, distant skylines, recessed details.",
  },
};

/** One palette step, ready to paint: its token, step, hex and the ink that reads on it. */
export type Swatch = { token: string; step: string; hex: string; ink: string };

/**
 * @function swatches
 * @param name {PaletteName} the palette
 * @returns {Swatch[]} the palette's steps, lightest first, each with its readable ink
 */
export const swatches = (name: PaletteName): Swatch[] =>
  Object.entries(PALETTE[name] as Record<string, string>)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([step, hex]) => ({ token: `${name}-${step}`, step, hex, ink: inkFor(hex) }));

/** A named brand color with the job it does. */
export type BrandColor = { name: string; token: string; hex: string; usage: string };

/** The five committed core colors from the brand study. */
export const CORE_COLORS: readonly BrandColor[] = [
  {
    name: "Mist",
    token: "evergreen-50",
    hex: PALETTE.evergreen["50"],
    usage: "Body text on dark, off-white surfaces",
  },
  {
    name: "Evergreen",
    token: "evergreen-500",
    hex: PALETTE.evergreen["500"],
    usage: "Logo, headers, borders, primary buttons",
  },
  {
    name: "Cascade",
    token: "cascade-200",
    hex: PALETTE.cascade["200"],
    usage: "Accent headers, highlighted text",
  },
  {
    name: "Bark",
    token: "bark-200",
    hex: PALETTE.bark["200"],
    usage: "Warm contrast: dividers, callouts",
  },
  {
    name: "Pitch",
    token: "evergreen-950",
    hex: PALETTE.evergreen["950"],
    usage: "Page background, dark surfaces",
  },
];

/** The semantic tokens theme.css defines, with the hex each resolves to. */
export const SEMANTIC_TOKENS: readonly BrandColor[] = [
  {
    name: "Background",
    token: "background",
    hex: PALETTE.evergreen["950"],
    usage: "The page itself",
  },
  { name: "Surface", token: "surface", hex: "#0b261a", usage: "Cards and panels" },
  {
    name: "Surface elevated",
    token: "surface-elevated",
    hex: "#0f3322",
    usage: "Raised cards, hover states",
  },
  { name: "Foreground", token: "foreground", hex: PALETTE.fog["100"], usage: "Body text" },
  { name: "Muted", token: "muted", hex: PALETTE.fog["300"], usage: "Secondary text" },
  {
    name: "Accent",
    token: "accent",
    hex: PALETTE.evergreen["400"],
    usage: "Buttons, links, focus rings",
  },
];
