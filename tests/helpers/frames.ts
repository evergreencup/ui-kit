/**
 * @file tests/helpers/frames.ts
 * @desc Manual requestAnimationFrame: queue callbacks, step frames at chosen timestamps.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { vi } from "vitest";

/**
 * @function manualFrames
 * @returns {{ step: (now: number) => void; pending: () => number; cancel: ReturnType<typeof vi.spyOn> }}
 *          `step` runs the queued callbacks at `now`; `pending` counts what's queued
 */
export const manualFrames = () => {
  let queue = new Map<number, FrameRequestCallback>();
  let id = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    id += 1;
    queue.set(id, cb);
    return id;
  });
  const cancel = vi.spyOn(window, "cancelAnimationFrame").mockImplementation((n) => {
    queue.delete(n);
  });
  return {
    step: (now: number) => {
      const run = queue;
      queue = new Map();
      for (const cb of run.values()) cb(now);
    },
    pending: () => queue.size,
    cancel,
  };
};
