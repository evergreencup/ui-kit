/**
 * @file src/utils/roving.ts
 * @desc Roving keyboard movement for radio groups and tab lists: arrows step and wrap, Home and End
 *       jump.
 *       Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

const STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * @function rovingKey
 * @param key {string} the pressed key
 * @param index {number} the focused item's position
 * @param count {number} how many items there are
 * @returns {number | null} the item to move to, or null when the key doesn't move
 */
export const rovingKey = (key: string, index: number, count: number): number | null => {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  const step = STEP[key];
  return step === undefined ? null : (index + step + count) % count;
};
