/**
 * @file src/hooks/useMediaQuery.ts
 * @desc Client hook over matchMedia through useSyncExternalStore: re-renders when the query
 *       flips, and reads the server value (default false) during SSR and hydration.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { useSyncExternalStore } from "react";

/**
 * @function useMediaQuery
 * @param query {string} a media query, e.g. "(pointer: coarse)"
 * @param serverValue {boolean} what to report on the server (default false)
 * @returns {boolean} whether the query matches
 */
export const useMediaQuery = (query: string, serverValue = false): boolean =>
  useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => {
        mq.removeEventListener("change", onChange);
      };
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );

/** The reduced-motion query every animated layer checks. */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * @function useMotionEnabled
 * @returns {boolean} true once mounted on a client that has not asked for reduced motion; false on
 *          the server, so animated layers never render into the HTML
 */
export const useMotionEnabled = (): boolean => !useMediaQuery(REDUCED_MOTION, true);
