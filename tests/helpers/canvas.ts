/**
 * @file tests/helpers/canvas.ts
 * @desc A recording 2D context for jsdom's canvas (it has none): every call is a vi.fn, and the
 *       latest context is reachable. `noContext()` makes getContext return null once.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { vi } from "vitest";

/** The context the canvas handed out last. */
export let lastContext: Record<string, unknown> | null = null;
let nullNext = false;

const makeContext = () => ({
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  globalAlpha: 1,
  lineWidth: 1,
  strokeStyle: "",
  fillStyle: "",
});

/**
 * @function installCanvas
 * @returns {void} patches HTMLCanvasElement.prototype.getContext
 */
export const installCanvas = (): void => {
  HTMLCanvasElement.prototype.getContext = function getContext() {
    if (nullNext) {
      nullNext = false;
      return null;
    }
    lastContext = makeContext();
    return lastContext;
  } as unknown as HTMLCanvasElement["getContext"];
};

/**
 * @function noContext
 * @returns {void} the next getContext call returns null
 */
export const noContext = (): void => {
  nullNext = true;
};
