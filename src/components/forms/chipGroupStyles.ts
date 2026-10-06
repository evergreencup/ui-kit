/**
 * @file src/components/forms/chipGroupStyles.ts
 * @desc The grid and group layout the chip and option-card pickers share.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** How many columns a picker lays out on wide screens. */
export type PickerColumns = 2 | 3;

/** Grid classes per column count: two on phones, then the count from sm. */
export const PICKER_GRID: Record<PickerColumns, string> = {
  2: "grid grid-cols-1 gap-2 sm:grid-cols-2",
  3: "grid grid-cols-2 gap-2 sm:grid-cols-3",
};

/** One picker option: its value, label and whether it can be picked. */
export type PickerOption<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean | undefined;
};

/**
 * @function toggleValue
 * @param selected {readonly T[]} the current selection
 * @param value {T} the value toggled
 * @param max {number} the most values allowed (default unlimited)
 * @returns {T[]} the selection with the value added or removed; unchanged when adding past max
 */
export const toggleValue = <T extends string>(
  selected: readonly T[],
  value: T,
  max = Number.POSITIVE_INFINITY,
): T[] => {
  if (selected.includes(value)) return selected.filter((v) => v !== value);
  return selected.length < max ? [...selected, value] : [...selected];
};
