/**
 * @file src/hooks/useMounted.ts
 * @desc Client hook: false during SSR and hydration, true after. For portals, whose target
 *       (document.body) exists only on the client.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { useSyncExternalStore } from "react";

const noop = (): (() => void) => () => undefined;

/**
 * @function useMounted
 * @returns {boolean} true on the client after hydration, false on the server
 */
export const useMounted = (): boolean =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
