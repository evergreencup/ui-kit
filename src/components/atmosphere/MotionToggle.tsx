/**
 * @file src/components/atmosphere/MotionToggle.tsx
 * @desc Client pause button for the moving backdrops (WCAG 2.2.2): pressed while paused, and it
 *       stops the hero video, the weather canvases and the leaf together. It renders nothing
 *       while the visitor asks for reduced motion, since nothing moves then.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

"use client";

import { REDUCED_MOTION, useMediaQuery } from "../../hooks/useMediaQuery.js";
import { setMotionPaused, useMotionPaused } from "../../hooks/useMotionPause.js";
import { cx } from "../../utils/cx.js";
import { buttonClasses } from "../basics/buttonStyles.js";
import { PauseIcon, PlayIcon } from "../icons/icons.js";

/** The button's name and its classes. */
export type MotionToggleProps = {
  /** Accessible name (default "Pause background motion"); aria-pressed carries the state. */
  label?: string | undefined;
  /** Positioning classes, e.g. "absolute right-4 bottom-4". */
  className?: string | undefined;
};

/**
 * @function MotionToggle
 * @param props {MotionToggleProps} label and className
 * @returns {JSX.Element | null} the round pause/play button, or nothing under reduced motion
 */
export const MotionToggle = ({
  label = "Pause background motion",
  className,
}: MotionToggleProps) => {
  const reduced = useMediaQuery(REDUCED_MOTION, true);
  const paused = useMotionPaused();
  if (reduced) return null;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={paused}
      title={paused ? "Play background motion" : label}
      onClick={() => {
        setMotionPaused(!paused);
      }}
      className={buttonClasses({
        variant: "icon",
        pill: true,
        className: cx(
          "size-11 bg-evergreen-950/70 backdrop-blur-sm hover:text-evergreen-50",
          className,
        ),
      })}
    >
      {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
    </button>
  );
};
