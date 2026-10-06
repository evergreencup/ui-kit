/**
 * @file src/components/forms/selectKeys.ts
 * @desc The listbox's keyboard as a pure function: which option a key moves to, or whether it
 *       commits or closes. Select runs it; tests cover it directly.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** What a key press does in an open listbox. */
export type ListboxAction =
  | { type: "move"; index: number }
  | { type: "commit" }
  | { type: "close" }
  | { type: "none" };

/**
 * @function listboxKey
 * @param key {string} KeyboardEvent.key
 * @param index {number} the focused option
 * @param count {number} how many options there are
 * @returns {ListboxAction} what to do; arrows clamp at the ends, Home and End jump
 */
export const listboxKey = (key: string, index: number, count: number): ListboxAction => {
  const last = Math.max(count - 1, 0);
  switch (key) {
    case "ArrowDown":
      return { type: "move", index: Math.min(last, index + 1) };
    case "ArrowUp":
      return { type: "move", index: Math.max(0, index - 1) };
    case "Home":
      return { type: "move", index: 0 };
    case "End":
      return { type: "move", index: last };
    case "Enter":
    case " ":
      return { type: "commit" };
    case "Escape":
    case "Tab":
      return { type: "close" };
    default:
      return { type: "none" };
  }
};

/** The keys that open a closed listbox from its trigger. */
export const OPEN_KEYS: ReadonlySet<string> = new Set(["ArrowDown", "ArrowUp", "Enter", " "]);
