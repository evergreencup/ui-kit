/**
 * @file src/components/atmosphere/ParallaxScope.tsx
 * @desc Client wrapper that eases --px/--py toward the pointer's offset from its center (-1 to
 *       1 times strength), so parallax-layer children shift by depth. Off for reduced motion and
 *       coarse pointers.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { type ReactNode, useEffect, useRef } from "react";

/** Children, wrapper classes and how strongly the layers follow the pointer. */
export type ParallaxScopeProps = {
  children: ReactNode;
  className?: string | undefined;
  strength?: number | undefined;
};

/** How much of the remaining distance --px/--py close each frame. */
export const PARALLAX_EASE = 0.08;

/**
 * @function ParallaxScope
 * @param props {ParallaxScopeProps} children, className and strength (default 1)
 * @returns {JSX.Element} an aria-hidden div that writes --px/--py as the pointer moves
 */
export const ParallaxScope = ({ children, className, strength = 1 }: ParallaxScopeProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    const off = ["(prefers-reduced-motion: reduce)", "(pointer: coarse)"].some(
      (q) => window.matchMedia(q).matches,
    );
    if (off || !node) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (e: MouseEvent): void => {
      const rect = node.getBoundingClientRect();
      target.x = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2 || 1)) * strength;
      target.y = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2 || 1)) * strength;
    };
    const onLeave = (): void => {
      target.x = 0;
      target.y = 0;
    };
    const loop = (): void => {
      current.x += (target.x - current.x) * PARALLAX_EASE;
      current.y += (target.y - current.y) * PARALLAX_EASE;
      node.style.setProperty("--px", current.x.toFixed(3));
      node.style.setProperty("--py", current.y.toFixed(3));
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={ref} aria-hidden className={className}>
      {children}
    </div>
  );
};
