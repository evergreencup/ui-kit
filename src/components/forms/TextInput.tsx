/**
 * @file src/components/forms/TextInput.tsx
 * @desc A text input in the boxed or inline style. With a `label` it renders inside FormField,
 *       wired to its hint and error; without one it is the bare control. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { fieldControlProps, MaybeField, type OptionalFieldProps, splitField } from "./FormField.js";
import { type FieldVariant, fieldClasses } from "./fieldStyles.js";

/** Native input props, plus the control style and, optionally, the field props. */
export type TextInputProps = Omit<ComponentProps<"input">, "id"> &
  OptionalFieldProps & { variant?: FieldVariant | undefined };

/**
 * @function TextInput
 * @param props {TextInputProps} id, variant (default "boxed"), label, hint, error, required,
 *        labelStyle, hideLabel, wrapperClassName and native input props
 * @returns {JSX.Element} the input, labeled when a label is given
 */
export const TextInput = ({
  variant,
  className,
  "aria-describedby": describedBy,
  ...props
}: TextInputProps) => {
  const [field, native] = splitField(props);
  return (
    <MaybeField {...field}>
      <input
        {...native}
        required={field.required}
        {...fieldControlProps({ ...field, describedBy })}
        className={fieldClasses(variant, Boolean(field.error), className)}
      />
    </MaybeField>
  );
};
