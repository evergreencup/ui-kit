/**
 * @file src/components/forms/SubmitButton.tsx
 * @desc Client submit button that goes pending on its own while the surrounding form's action
 *       runs (react-dom's useFormStatus), or when told to. Wraps Button.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "../basics/Button.js";

/** Button props; type is always submit. */
export type SubmitButtonProps = Omit<ButtonProps, "type">;

/**
 * @function SubmitButton
 * @param props {SubmitButtonProps} Button props; pending (OR'd with the form's status),
 *        pendingLabel (default "Submitting…") and size (default "lg")
 * @returns {JSX.Element} a type="submit" Button
 */
export const SubmitButton = ({
  pending = false,
  pendingLabel = "Submitting…",
  size = "lg",
  ...props
}: SubmitButtonProps) => {
  const status = useFormStatus();
  return (
    <Button
      type="submit"
      size={size}
      pending={pending || status.pending}
      pendingLabel={pendingLabel}
      {...props}
    />
  );
};
