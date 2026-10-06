/**
 * @file src/components/forms/ToggleChips.tsx
 * @desc A labeled multi-select chip group (roles, skillsets): each chip toggles, an optional
 *       `max` disables the rest once reached. Server-safe; the caller owns the state.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ChipTone } from "../basics/chipStyles.js";
import { ChipButton } from "./ChipButton.js";
import {
  PICKER_GRID,
  type PickerColumns,
  type PickerOption,
  toggleValue,
} from "./chipGroupStyles.js";
import { PickerGroup } from "./PickerGroup.js";

/** Options, the controlled selection and handler, and the group's look. */
export type ToggleChipsProps<T extends string> = {
  options: readonly PickerOption<T>[];
  selected: readonly T[];
  onChange: (next: T[]) => void;
  /** Names the group for screen readers. */
  label: string;
  max?: number | undefined;
  disabled?: boolean | undefined;
  columns?: PickerColumns | undefined;
  tone?: ChipTone | undefined;
};

/**
 * @function ToggleChips
 * @param props {ToggleChipsProps<T>} options, selected, onChange, label, max, disabled, columns
 *        (default 3) and tone
 * @returns {JSX.Element} a fieldset grid of pressed/unpressed chips
 */
export const ToggleChips = <T extends string>({
  options,
  selected,
  onChange,
  label,
  max,
  disabled = false,
  columns = 3,
  tone,
}: ToggleChipsProps<T>) => {
  const full = max !== undefined && selected.length >= max;
  return (
    <PickerGroup label={label} className={PICKER_GRID[columns]}>
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <ChipButton
            key={o.value}
            pressed={on}
            tone={tone}
            disabled={disabled || Boolean(o.disabled) || (full && !on)}
            onClick={() => {
              onChange(toggleValue(selected, o.value, max));
            }}
          >
            {o.label}
          </ChipButton>
        );
      })}
    </PickerGroup>
  );
};
