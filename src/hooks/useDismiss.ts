/**
 * @file src/hooks/useDismiss.ts
 * @desc Client hooks for overlays: Escape to close, a click outside to close, and a counted
 *       page scroll lock. The select's listbox and the mobile menu share them.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { type RefObject, useEffect } from "react";

/**
 * @function useEscapeKey
 * @param active {boolean} listen only while true (an overlay is open)
 * @param onEscape {() => void} called on Escape
 * @returns {void}
 */
export const useEscapeKey = (active: boolean, onEscape: () => void): void => {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, onEscape]);
};

/**
 * @function useOutsideClick
 * @param ref {RefObject<HTMLElement | null>} the element a click must land outside of
 * @param active {boolean} listen only while true
 * @param onOutside {() => void} called on a mousedown outside the element
 * @returns {void}
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void,
): void => {
  useEffect(() => {
    if (!active) return;
    const onMouseDown = (event: MouseEvent): void => {
      if (!ref.current?.contains(event.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [ref, active, onOutside]);
};

let locks = 0;
let saved = "";

/**
 * @function useScrollLock
 * @param active {boolean} lock the page's scroll while true
 * @returns {void} counted: two open overlays release the page only when both close, and the
 *          page's own inline overflow comes back
 */
export const useScrollLock = (active: boolean): void => {
  useEffect(() => {
    if (!active) return;
    if (locks === 0) {
      saved = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks === 0) document.body.style.overflow = saved;
    };
  }, [active]);
};
