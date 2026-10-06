/**
 * @file src/components/atmosphere/ParticleLayer.tsx
 * @desc Client canvas that runs a weather engine, picked by name so a server component can render
 *       it (engines hold functions, which can't cross the client boundary): sized to its box at up to 2x DPR, reseeded on
 *       resize, paused while the tab is hidden, and not rendered at all under reduced motion.
 *       RainLayer and SnowLayer are this with an engine.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { useEffect, useRef } from "react";
import { useMotionEnabled } from "../../hooks/useMediaQuery.js";
import { mulberry32 } from "../../utils/random.js";
import { LAYER, parallaxStyle } from "./parallax.js";
import {
  type Bounds,
  ENGINES,
  type Intensity,
  type ParticleEngine,
  type WeatherKind,
} from "./particles.js";

/** The weather, how heavy, the canvas alpha and the parallax depth. */
export type ParticleLayerProps = {
  weather: WeatherKind;
  intensity?: Intensity | undefined;
  opacity?: number | undefined;
  depth?: number | undefined;
};

const runEngine = <P,>(
  canvas: HTMLCanvasElement,
  engine: ParticleEngine<P>,
  intensity: Intensity,
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => undefined;
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const count = engine.counts[mobile ? "mobile" : "desktop"][intensity];
  const gen = mulberry32(engine.seed);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = (): Bounds => ({ width: canvas.clientWidth, height: canvas.clientHeight });
  let particles: P[] = [];
  let frame: number | null = null;
  let last = 0;
  let t = 0;

  const reset = (): void => {
    const b = bounds();
    canvas.width = b.width * dpr;
    canvas.height = b.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: count }, () => engine.spawn(gen, b));
  };

  const tick = (now: number): void => {
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    t += dt;
    const b = bounds();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = engine.color;
    ctx.fillStyle = engine.color;
    for (const p of particles) {
      engine.step(p, dt, t, gen, b);
      engine.draw(ctx, p, t);
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(tick);
  };

  const start = (): void => {
    last = 0;
    frame = requestAnimationFrame(tick);
  };
  const stop = (): void => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  };
  const onVisibility = (): void => {
    if (document.visibilityState === "hidden") stop();
    else start();
  };

  reset();
  const observer = new ResizeObserver(reset);
  observer.observe(canvas);
  document.addEventListener("visibilitychange", onVisibility);
  start();
  return () => {
    stop();
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
};

/**
 * @function ParticleLayer
 * @param props {ParticleLayerProps} weather, intensity (default "light"), opacity (default 0.18)
 *        and depth (default 6)
 * @returns {JSX.Element | null} a full-bleed canvas, or nothing under reduced motion and on the
 *          server
 */
export const ParticleLayer = ({
  weather,
  intensity = "light",
  opacity = 0.18,
  depth = 6,
}: ParticleLayerProps) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    if (!enabled || !ref.current) return;
    return runEngine(ref.current, ENGINES[weather] as ParticleEngine<unknown>, intensity);
  }, [enabled, weather, intensity]);

  if (!enabled) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`${LAYER} inset-0 size-full`}
      style={parallaxStyle(depth, { opacity })}
    />
  );
};
