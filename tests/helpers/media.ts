/**
 * @file tests/helpers/media.ts
 * @desc A controllable window.matchMedia: tests set which queries match and can flip one live,
 *       firing "change" to every listener on that query.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

const matches = new Map<string, boolean>();
const listeners = new Map<string, Set<() => void>>();

/**
 * @function installMedia
 * @returns {void} replaces window.matchMedia with the controllable stub
 */
export const installMedia = (): void => {
  window.matchMedia = (query: string) =>
    ({
      media: query,
      get matches() {
        return matches.get(query) ?? false;
      },
      addEventListener: (_: string, cb: () => void) => {
        const set = listeners.get(query) ?? new Set();
        set.add(cb);
        listeners.set(query, set);
      },
      removeEventListener: (_: string, cb: () => void) => {
        listeners.get(query)?.delete(cb);
      },
    }) as unknown as MediaQueryList;
};

/**
 * @function setMedia
 * @param query {string} a media query
 * @param value {boolean} whether it matches now; listeners hear the change
 * @returns {void}
 */
export const setMedia = (query: string, value: boolean): void => {
  matches.set(query, value);
  for (const cb of listeners.get(query) ?? []) cb();
};

/**
 * @function listenerCount
 * @param query {string} a media query
 * @returns {number} how many change listeners it has
 */
export const listenerCount = (query: string): number => listeners.get(query)?.size ?? 0;

/**
 * @function resetMedia
 * @returns {void} clears every match (listeners stay with their components until unmount)
 */
export const resetMedia = (): void => {
  matches.clear();
};

/** The reduced-motion query. */
export const REDUCE = "(prefers-reduced-motion: reduce)";
