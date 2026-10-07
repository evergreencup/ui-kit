/**
 * @file src/components/basics/Button.tsx
 * @desc Button primitive. Defaults to type="button" so it never submits a form by accident;
 *       `pending` disables it and swaps the label. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import type { ComponentProps, ReactNode } from "react";
import { type ButtonClassOptions, buttonClasses } from "./buttonStyles.js";

/** Native button props, plus the variant, size, pill shape and a pending state. */
export type ButtonProps = ComponentProps<"button"> &
  Omit<ButtonClassOptions, "className"> & {
    /** Disable the button and show `pendingLabel` instead of the children. */
    pending?: boolean | undefined;
    /** The label while pending (default "Working…"). */
    pendingLabel?: ReactNode | undefined;
  };

/**
 * @function Button
 * @param props {ButtonProps} native button props, variant, size, pill, pending and pendingLabel
 * @returns {JSX.Element} the styled button; aria-busy while pending
 */
export const Button = ({
  variant,
  size,
  pill,
  pending = false,
  pendingLabel = "Working…",
  className,
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={Boolean(disabled) || pending}
    aria-busy={pending || undefined}
    className={buttonClasses({ variant, size, pill, className })}
    {...props}
  >
    {pending ? pendingLabel : children}
  </button>
);
