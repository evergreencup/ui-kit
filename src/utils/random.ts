/**
 * @file src/utils/random.ts
 * @desc Seeded pseudo-random helpers (mulberry32) so atmosphere layers jitter the same way on
 *       the server and the client, with no hydration mismatch.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** A generator yielding successive pseudo-random numbers in [0, 1). */
export type Random = () => number;

/**
 * @function mulberry32
 * @param seed {number} 32-bit unsigned integer seed
 * @returns {Random} a deterministic generator for that seed
 */
export const mulberry32 = (seed: number): Random => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * @function randRange
 * @param gen {Random} a generator from mulberry32 (or compatible)
 * @param min {number} inclusive lower bound
 * @param max {number} exclusive upper bound
 * @returns {number} a value in [min, max)
 */
export const randRange = (gen: Random, min: number, max: number): number =>
  min + gen() * (max - min);
