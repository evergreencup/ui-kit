/**
 * @file src/components/atmosphere/particles.ts
 * @desc The weather engines as pure data and functions: how many particles, how one spawns, moves
 *       and draws. Rain falls fast and slants left; snow falls slow and sways. ParticleLayer runs
 *       either one on a canvas.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { type Random, randRange } from "../../utils/random.js";

/** How heavy the weather is. */
export type Intensity = "light" | "heavy";

/** The canvas size particles live in, in CSS pixels. */
export type Bounds = { width: number; height: number };

/** One weather system: particle counts, a seed, and spawn, step and draw functions. */
export type ParticleEngine<P> = {
  /** Particle counts per intensity, on desktop and on phones (768px and under). */
  counts: { desktop: Record<Intensity, number>; mobile: Record<Intensity, number> };
  seed: number;
  /** The paint color for the whole frame. */
  color: string;
  spawn: (gen: Random, bounds: Bounds) => P;
  /** Moves a particle by dt seconds at time t, respawning it at the top when it leaves. */
  step: (p: P, dt: number, t: number, gen: Random, bounds: Bounds) => void;
  draw: (ctx: CanvasRenderingContext2D, p: P, t: number) => void;
};

/** A raindrop: position, velocity, streak length and alpha. */
export type Drop = { x: number; y: number; vx: number; vy: number; length: number; alpha: number };

/** A snowflake: position, radius, fall speed, sway and alpha. */
export type Flake = {
  x: number;
  y: number;
  r: number;
  vy: number;
  swayAmp: number;
  swaySpeed: number;
  swayPhase: number;
  alpha: number;
};

/** Rain: thin slanted streaks. */
export const RAIN: ParticleEngine<Drop> = {
  counts: { desktop: { light: 110, heavy: 190 }, mobile: { light: 45, heavy: 80 } },
  seed: 2131,
  color: "rgba(209, 229, 241, 1)",
  spawn: (gen, { width, height }) => ({
    x: randRange(gen, 0, width),
    y: randRange(gen, -height, height),
    vy: randRange(gen, 260, 520),
    vx: randRange(gen, -60, -15),
    length: randRange(gen, 6, 14),
    alpha: randRange(gen, 0.22, 0.55),
  }),
  step: (p, dt, _t, gen, { width, height }) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.y > height + 20) {
      p.y = -10;
      p.x = randRange(gen, 0, width);
    }
    if (p.x < -20) p.x = width + 10;
  },
  draw: (ctx, p) => {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.length * 0.2, p.y + p.length);
    ctx.stroke();
  },
};

/** The weather a ParticleLayer can run, by name (a plain string crosses the client boundary). */
export type WeatherKind = "rain" | "snow";

/** Snow: soft round flakes that sway as they fall. */
export const SNOW: ParticleEngine<Flake> = {
  counts: { desktop: { light: 90, heavy: 170 }, mobile: { light: 40, heavy: 75 } },
  seed: 90210,
  color: "rgba(233, 243, 249, 1)",
  spawn: (gen, { width, height }) => ({
    x: randRange(gen, 0, width),
    y: randRange(gen, -height, height),
    r: randRange(gen, 1, 3),
    vy: randRange(gen, 18, 55),
    swayAmp: randRange(gen, 6, 22),
    swaySpeed: randRange(gen, 0.4, 1.1),
    swayPhase: randRange(gen, 0, Math.PI * 2),
    alpha: randRange(gen, 0.35, 0.9),
  }),
  step: (p, dt, _t, gen, { width, height }) => {
    p.y += p.vy * dt;
    if (p.y > height + 6) {
      p.y = -6;
      p.x = randRange(gen, 0, width);
    }
  },
  draw: (ctx, p, t) => {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x + Math.sin(t * p.swaySpeed + p.swayPhase) * p.swayAmp, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  },
};

/** Each weather's engine. */
export const ENGINES: { rain: ParticleEngine<Drop>; snow: ParticleEngine<Flake> } = {
  rain: RAIN,
  snow: SNOW,
};
