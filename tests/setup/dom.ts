/**
 * @file tests/setup/dom.ts
 * @desc Setup for every test file: jest-dom matchers, DOM cleanup, and the browser APIs jsdom
 *       lacks: a controllable matchMedia, ResizeObserver, a recording 2D canvas context and the
 *       clipboard. Each resets between tests.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { installCanvas } from "../helpers/canvas.js";
import { installMedia, resetMedia } from "../helpers/media.js";

installMedia();
installCanvas();

class ResizeObserverStub {
  static instances: ResizeObserverStub[] = [];
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverStub.instances.push(this);
  }
  observe(): void {}
  disconnect(): void {}
  unobserve(): void {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

afterEach(() => {
  cleanup();
  resetMedia();
  ResizeObserverStub.instances.length = 0;
  document.body.style.overflow = "";
});

export { ResizeObserverStub };
