/**
 * @file tests/components/atmosphere/weather.test.tsx
 * @desc The rain and snow engines, ParticleLayer's canvas loop, and the Rain/Snow wrappers.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ParticleLayer } from "../../../src/components/atmosphere/ParticleLayer.js";
import { type Drop, type Flake, RAIN, SNOW } from "../../../src/components/atmosphere/particles.js";
import { RainLayer, SnowLayer } from "../../../src/components/atmosphere/Weather.js";
import { mulberry32 } from "../../../src/utils/random.js";
import { lastContext, noContext } from "../../helpers/canvas.js";
import { manualFrames } from "../../helpers/frames.js";
import { REDUCE, setMedia } from "../../helpers/media.js";
import { ResizeObserverStub } from "../../setup/dom.js";

const bounds = { width: 100, height: 50 };
const ctx = () => ({
  globalAlpha: 1,
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
});

describe("engines", () => {
  it("spawns raindrops in bounds, moves them, wraps them and draws streaks", () => {
    const gen = mulberry32(1);
    const p: Drop = RAIN.spawn(gen, bounds);
    expect(p.x).toBeGreaterThanOrEqual(0);
    expect(p.x).toBeLessThan(100);
    const y = p.y;
    RAIN.step(p, 0.01, 0, gen, bounds);
    expect(p.y).toBeGreaterThan(y);
    p.y = 80;
    RAIN.step(p, 0, 0, gen, bounds);
    expect(p.y).toBe(-10);
    p.x = -30;
    RAIN.step(p, 0, 0, gen, bounds);
    expect(p.x).toBe(110);
    const c = ctx();
    RAIN.draw(c as unknown as CanvasRenderingContext2D, p, 0);
    expect(c.lineTo).toHaveBeenCalled();
    expect(c.globalAlpha).toBe(p.alpha);
  });

  it("spawns flakes, lets them fall and wrap, and draws swaying dots", () => {
    const gen = mulberry32(2);
    const f: Flake = SNOW.spawn(gen, bounds);
    f.y = 0;
    SNOW.step(f, 1, 0, gen, bounds);
    expect(f.y).toBe(f.vy);
    f.y = 60;
    SNOW.step(f, 0, 0, gen, bounds);
    expect(f.y).toBe(-6);
    const c = ctx();
    SNOW.draw(c as unknown as CanvasRenderingContext2D, f, 1);
    expect(c.arc).toHaveBeenCalledWith(
      f.x + Math.sin(f.swaySpeed + f.swayPhase) * f.swayAmp,
      f.y,
      f.r,
      0,
      Math.PI * 2,
    );
  });
});

describe("ParticleLayer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing under reduced motion", () => {
    setMedia(REDUCE, true);
    expect(render(<RainLayer />).container.firstChild).toBeNull();
  });

  it("animates frames, pauses while hidden, reseeds on resize and stops on unmount", () => {
    const frames = manualFrames();
    const { container, unmount } = render(
      <ParticleLayer weather="rain" intensity="heavy" opacity={0.3} depth={2} />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas).toHaveStyle({ opacity: "0.3" });
    const c = lastContext as Record<string, ReturnType<typeof vi.fn>>;
    expect(c.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    frames.step(1000);
    frames.step(1016);
    expect(c.clearRect).toHaveBeenCalledTimes(2);
    expect(c.stroke).toHaveBeenCalledTimes(2 * RAIN.counts.desktop.heavy);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(frames.pending()).toBe(0);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(frames.pending()).toBe(1);
    ResizeObserverStub.instances.at(-1)?.callback([], {} as ResizeObserver);
    expect(c.setTransform).toHaveBeenCalledTimes(2);
    unmount();
    expect(frames.pending()).toBe(0);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(frames.cancel).toHaveBeenCalled();
  });

  it("uses phone counts, a 2x DPR cap and the snow fill", () => {
    const frames = manualFrames();
    setMedia("(max-width: 768px)", true);
    Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: 3 });
    render(<SnowLayer />);
    const c = lastContext as Record<string, ReturnType<typeof vi.fn>>;
    expect(c.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
    frames.step(5);
    expect(c.fill).toHaveBeenCalledTimes(SNOW.counts.mobile.light);
    expect(c.fillStyle).toBe(SNOW.color);
    Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: 0 });
    render(<SnowLayer intensity="heavy" opacity={0.5} />);
    expect(
      (lastContext as Record<string, ReturnType<typeof vi.fn>>).setTransform,
    ).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
  });

  it("does nothing without a 2D context", () => {
    const frames = manualFrames();
    noContext();
    const { unmount } = render(<RainLayer />);
    expect(frames.pending()).toBe(0);
    unmount();
  });
});
