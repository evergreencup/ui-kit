/**
 * @file src/components/atmosphere/presets.ts
 * @desc The atmosphere's scene presets, one per page mood, each a few overrides on one default
 *       scene (cascade sky, Rainier and the skyline centered, both mist bands, light rain).
 *       `scene()` resolves a preset or a custom partial into a full config.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { Intensity } from "./particles.js";

/** A full scene: what the Atmosphere stacks and how. */
export type SceneConfig = {
  skyTintTop: string;
  skyTintMid: string;
  stars: number;
  rainier: { show: boolean; offsetX: number; scale: number };
  skyline: { show: boolean; offsetX: number; opacity: number };
  mistA: boolean;
  mistB: boolean;
  farDensity: number;
  nearDensity: number;
  rain: Intensity | "none";
  snow: Intensity | "none";
  leaf: boolean;
};

/** The default scene every preset starts from. */
export const DEFAULT_SCENE: SceneConfig = {
  skyTintTop: "var(--color-cascade-900)",
  skyTintMid: "var(--color-evergreen-950)",
  stars: 20,
  rainier: { show: true, offsetX: 0, scale: 1 },
  skyline: { show: true, offsetX: 0, opacity: 0.28 },
  mistA: true,
  mistB: true,
  farDensity: 1,
  nearDensity: 1,
  rain: "light",
  snow: "none",
  leaf: false,
};

const HIDDEN = {
  rainier: { show: false, offsetX: 0, scale: 1 },
  skyline: { show: false, offsetX: 0, opacity: 0 },
};
const FOREST = { ...HIDDEN, skyTintTop: "var(--color-evergreen-900)" };

/** The named presets as overrides on DEFAULT_SCENE. */
export const SCENE_PRESETS = {
  home: { stars: 22, skyline: { show: true, offsetX: 0.1, opacity: 0.28 }, leaf: true },
  rules: { ...FOREST, stars: 12, farDensity: 1.3, nearDensity: 1.3 },
  pools: {
    skyTintTop: "var(--color-cascade-800)",
    stars: 32,
    rainier: { show: true, offsetX: -0.2, scale: 0.9 },
    skyline: { show: true, offsetX: 0.05, opacity: 0.35 },
    mistB: false,
    nearDensity: 0.9,
  },
  schedule: {
    skyTintTop: "var(--color-bark-700)",
    stars: 10,
    rainier: { show: true, offsetX: 0.1, scale: 0.95 },
    skyline: { show: true, offsetX: 0.35, opacity: 0.22 },
  },
  teams: {
    stars: 18,
    rainier: { show: true, offsetX: 0.2, scale: 0.8 },
    skyline: { show: true, offsetX: -0.3, opacity: 0.25 },
    mistB: false,
    rain: "none",
  },
  stream: {
    stars: 16,
    rainier: { show: true, offsetX: -0.1, scale: 0.9 },
    skyline: { show: true, offsetX: 0, opacity: 0.36 },
    rain: "heavy",
  },
  donate: {
    stars: 14,
    rainier: { show: true, offsetX: 0, scale: 1.2 },
    skyline: HIDDEN.skyline,
    mistB: false,
    farDensity: 0.7,
    nearDensity: 0.8,
  },
  contributors: { ...FOREST, stars: 8, farDensity: 1.5, nearDensity: 1.4, rain: "none" },
  register: {
    rainier: { show: true, offsetX: 0.25, scale: 0.95 },
    skyline: { show: true, offsetX: -0.35, opacity: 0.26 },
    rain: "none",
    snow: "light",
  },
  soundtrack: {
    skyTintTop: "var(--color-cascade-800)",
    stars: 36,
    rainier: { show: true, offsetX: -0.25, scale: 0.85 },
    skyline: { show: true, offsetX: 0.25, opacity: 0.32 },
    farDensity: 1.1,
    rain: "none",
    snow: "light",
  },
  brand: {
    skyTintTop: "var(--color-cascade-800)",
    stars: 26,
    rainier: { show: true, offsetX: 0, scale: 1.05 },
    skyline: { show: true, offsetX: 0, opacity: 0.3 },
    rain: "none",
    leaf: true,
  },
  forest: { ...FOREST, stars: 6, farDensity: 1.4, nearDensity: 1.5, rain: "none" },
} as const satisfies Record<string, Partial<SceneConfig>>;

/** A preset's name. */
export type ScenePreset = keyof typeof SCENE_PRESETS;

/**
 * @function scene
 * @param preset {ScenePreset | Partial<SceneConfig>} a preset name, or overrides of the default
 * @returns {SceneConfig} the full scene
 */
export const scene = (preset: ScenePreset | Partial<SceneConfig>): SceneConfig => ({
  ...DEFAULT_SCENE,
  ...(typeof preset === "string" ? SCENE_PRESETS[preset] : preset),
});
