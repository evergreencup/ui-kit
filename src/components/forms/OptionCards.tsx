/**
 * @file src/components/forms/OptionCards.tsx
 * @desc A multi-select grid of option cards, each with a one-line blurb and a checkbox mark
 *       (staff roles). A card can be locked with a reason shown under its blurb. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { CheckIcon } from "../icons/icons.js";
import {
  PICKER_GRID,
  type PickerColumns,
  type PickerOption,
  toggleValue,
} from "./chipGroupStyles.js";
import { PickerGroup } from "./PickerGroup.js";

/** A card: a picker option with a blurb and an optional lock reason. */
export type OptionCard<T extends string> = PickerOption<T> & {
  blurb: string;
  lockedReason?: string | undefined;
};

/** Cards, the controlled selection and handler, and the group's label and layout. */
export type OptionCardsProps<T extends string> = {
  options: readonly OptionCard<T>[];
  selected: readonly T[];
  onChange: (next: T[]) => void;
  label: string;
  disabled?: boolean | undefined;
  columns?: PickerColumns | undefined;
};

const cardTone = (on: boolean, locked: boolean): string =>
  on
    ? "border-evergreen-400 bg-evergreen-500/15"
    : locked
      ? "cursor-not-allowed border-evergreen-800/50 bg-evergreen-950/30"
      : "border-evergreen-800/70 bg-evergreen-950/40 hover:border-evergreen-500/60";

/**
 * @function OptionCards
 * @param props {OptionCardsProps<T>} options, selected, onChange, label, disabled and columns
 *        (default 2)
 * @returns {JSX.Element} a fieldset grid of pressed/unpressed cards
 */
export const OptionCards = <T extends string>({
  options,
  selected,
  onChange,
  label,
  disabled = false,
  columns = 2,
}: OptionCardsProps<T>) => (
  <PickerGroup label={label} className={PICKER_GRID[columns]}>
    {options.map((o) => {
      const on = selected.includes(o.value);
      const locked = o.lockedReason !== undefined;
      return (
        <button
          key={o.value}
          type="button"
          aria-pressed={on}
          disabled={disabled || locked || Boolean(o.disabled)}
          onClick={() => {
            onChange(toggleValue(selected, o.value));
          }}
          className={cx(
            "flex flex-col gap-1 rounded-sm border p-3 text-left transition disabled:opacity-100",
            FOCUS_RING,
            cardTone(on, locked),
          )}
        >
          <span className="flex items-center justify-between gap-2">
            <span
              className={cx(
                "font-display font-semibold text-[12px] uppercase tracking-[0.16em]",
                on ? "text-evergreen-50" : locked ? "text-fog-500" : "text-fog-200",
              )}
            >
              {o.label}
            </span>
            <span
              aria-hidden
              className={cx(
                "grid size-4 shrink-0 place-items-center rounded-sm border transition",
                on
                  ? "border-evergreen-400 bg-evergreen-400 text-evergreen-950"
                  : "border-evergreen-700",
              )}
            >
              {on ? <CheckIcon className="size-3" strokeWidth={3} /> : null}
            </span>
          </span>
          <span
            className={cx("text-[11px] leading-relaxed", locked ? "text-fog-600" : "text-fog-400")}
          >
            {o.blurb}
          </span>
          {locked ? (
            <span className="text-[11px] text-bark-300 leading-relaxed">{o.lockedReason}</span>
          ) : null}
        </button>
      );
    })}
  </PickerGroup>
);
