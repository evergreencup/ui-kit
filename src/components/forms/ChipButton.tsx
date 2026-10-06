/**
 * @file src/components/forms/ChipButton.tsx
 * @desc One toggle chip as a pressed/unpressed button. ToggleChips and ChoiceChips render it.
 *       Server-safe (the handler comes from the caller).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { type ChipTone, chipClasses } from "../basics/chipStyles.js";

/** Native button props, plus the pressed state and tone. */
export type ChipButtonProps = Omit<ComponentProps<"button">, "type"> & {
  pressed: boolean;
  tone?: ChipTone | undefined;
};

/**
 * @function ChipButton
 * @param props {ChipButtonProps} pressed, tone and native button props
 * @returns {JSX.Element} a type="button" chip with aria-pressed
 */
export const ChipButton = ({ pressed, tone, className, ...props }: ChipButtonProps) => (
  <button
    type="button"
    aria-pressed={pressed}
    className={chipClasses(pressed, tone, className)}
    {...props}
  />
);
