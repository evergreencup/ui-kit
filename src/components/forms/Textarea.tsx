/**
 * @file src/components/forms/Textarea.tsx
 * @desc A multi-line textarea for long answers, boxed or inline, labeled through FormField when
 *       given a `label`. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { cx } from "../../utils/cx.js";
import { fieldControlProps, MaybeField, type OptionalFieldProps, splitField } from "./FormField.js";
import { type FieldVariant, fieldClasses } from "./fieldStyles.js";

/** Native textarea props, plus the control style and, optionally, the field props. */
export type TextareaProps = Omit<ComponentProps<"textarea">, "id"> &
  OptionalFieldProps & { variant?: FieldVariant | undefined };

/**
 * @function Textarea
 * @param props {TextareaProps} id, variant (default "boxed"), field props and native props
 * @returns {JSX.Element} the textarea, labeled when a label is given
 */
export const Textarea = ({
  variant = "boxed",
  className,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) => {
  const [field, native] = splitField(props);
  return (
    <MaybeField {...field}>
      <textarea
        {...native}
        required={field.required}
        {...fieldControlProps({ ...field, describedBy })}
        className={fieldClasses(
          variant,
          Boolean(field.error),
          cx("resize-y leading-relaxed", variant === "boxed" && "min-h-24", className),
        )}
      />
    </MaybeField>
  );
};
