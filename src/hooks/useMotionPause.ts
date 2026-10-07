/**
 * @file src/hooks/useMotionPause.ts
 * @desc The visitor's pause switch for the kit's moving backdrops (hero video, weather, leaf):
 *       one shared store, so a single MotionToggle pauses every layer on the page. The choice is
 *       kept in localStorage, so it holds across pages and visits where storage works.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

"use client";

import { useSyncExternalStore } from "react";

/** The localStorage key holding "1" while paused. */
export const MOTION_PAUSE_KEY = "egc-motion-paused";

let paused: boolean | null = null;
const listeners = new Set<() => void>();

const read = (): boolean => {
  if (paused === null) {
    try {
      paused = window.localStorage.getItem(MOTION_PAUSE_KEY) === "1";
    } catch {
      paused = false;
    }
  }
  return paused;
};

const subscribe = (onChange: () => void): (() => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};

/**
 * @function setMotionPaused
 * @param next {boolean} pause (true) or resume (false) every layer
 * @returns {void} also saves the choice; a blocked storage keeps it for this page only
 */
export const setMotionPaused = (next: boolean): void => {
  paused = next;
  try {
    window.localStorage.setItem(MOTION_PAUSE_KEY, next ? "1" : "0");
  } catch {
    // Private mode or blocked storage: the pause still holds until the page reloads.
  }
  for (const onChange of listeners) onChange();
};

/**
 * @function useMotionPaused
 * @returns {boolean} whether the visitor paused motion; false on the server
 */
export const useMotionPaused = (): boolean => useSyncExternalStore(subscribe, read, () => false);
