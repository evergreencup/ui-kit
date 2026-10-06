/**
 * @file src/components/forms/ChoiceChips.tsx
 * @desc A labeled single-choice chip row (a region, a mod filter): pressing a chip picks it. An
 *       option can carry its own tone (the cascade "Outside the PNW" chip). Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import type { ChipTone } from "../basics/chipStyles.js";
import { ChipButton } from "./ChipButton.js";
import type { PickerOption } from "./chipGroupStyles.js";
import { PickerGroup } from "./PickerGroup.js";

/** A choice, optionally in its own tone. */
export type ChoiceOption<T extends string> = PickerOption<T> & { tone?: ChipTone | undefined };

/** Options, the controlled value and handler, and the row's label. */
export type ChoiceChipsProps<T extends string> = {
  options: readonly ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  label: string;
  disabled?: boolean | undefined;
  className?: string | undefined;
};

/**
 * @function ChoiceChips
 * @param props {ChoiceChipsProps<T>} options, value, onChange, label, disabled and className
 * @returns {JSX.Element} a fieldset wrap of compact chips, the chosen one pressed
 */
export const ChoiceChips = <T extends string>({
  options,
  value,
  onChange,
  label,
  disabled = false,
  className,
}: ChoiceChipsProps<T>) => (
  <PickerGroup label={label} className={cx("flex flex-wrap gap-2", className)}>
    {options.map((o) => (
      <ChipButton
        key={o.value}
        pressed={o.value === value}
        tone={o.tone}
        disabled={disabled || Boolean(o.disabled)}
        className="px-2.5 py-1 text-[10px] tracking-[0.2em]"
        onClick={() => {
          onChange(o.value);
        }}
      >
        {o.label}
      </ChipButton>
    ))}
  </PickerGroup>
);
