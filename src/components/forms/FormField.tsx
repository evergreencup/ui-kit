/**
 * @file src/components/forms/FormField.tsx
 * @desc The label, control, hint and error stack every field shares, and the one rule for the
 *       ids that tie them together (`<id>-hint`, `<id>-error`, aria-describedby, aria-invalid).
 *       The label gets `<id>-label` for controls that need a labelledby. A hint may be a list of
 *       lines. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { FIELD_ERROR, FIELD_HINT, FIELD_LABEL, type FieldLabelStyle } from "./fieldStyles.js";

/** The props a labeled field takes around its control. */
export type FieldProps = {
  /** The control's id; the label points at it. */
  id: string;
  label: ReactNode;
  /** Help under the control; an array renders one line each. */
  hint?: ReactNode | readonly string[] | undefined;
  /** Error under the control; it replaces the hint and marks the control invalid. */
  error?: ReactNode | undefined;
  required?: boolean | undefined;
  /** Label look (default "display"). */
  labelStyle?: FieldLabelStyle | undefined;
  /** Hide the label visually; it still names the control. */
  hideLabel?: boolean | undefined;
  /** Classes on the field's wrapper. */
  wrapperClassName?: string | undefined;
};

/**
 * @function fieldControlProps
 * @param input {{ id: string; hint?: unknown; error?: unknown; describedBy?: string }} the field's
 *        id, hint, error and the caller's own aria-describedby
 * @returns {{ id: string; "aria-describedby": string | undefined; "aria-invalid": true | undefined }}
 *          the props the control takes so the hint and error are announced with it
 */
export const fieldControlProps = ({
  id,
  hint,
  error,
  describedBy,
}: {
  id: string;
  hint?: unknown;
  error?: unknown;
  describedBy?: string | undefined;
}) => ({
  id,
  "aria-describedby":
    [error ? `${id}-error` : hint ? `${id}-hint` : null, describedBy].filter(Boolean).join(" ") ||
    undefined,
  "aria-invalid": error ? (true as const) : undefined,
});

/**
 * @function FormField
 * @param props {FieldProps & { children: ReactNode }} the field props and the control
 * @returns {JSX.Element} the labeled stack
 */
export const FormField = ({
  id,
  label,
  hint,
  error,
  required = false,
  labelStyle = "display",
  hideLabel = false,
  wrapperClassName,
  children,
}: FieldProps & { children: ReactNode }) => (
  <div className={cx("flex flex-col gap-2", wrapperClassName)}>
    <label
      id={`${id}-label`}
      htmlFor={id}
      className={cx(FIELD_LABEL[labelStyle], hideLabel && "sr-only")}
    >
      {label}
      {required ? (
        <span aria-hidden className="ml-1 text-bark-300">
          *
        </span>
      ) : null}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className={FIELD_ERROR}>
        {error}
      </p>
    ) : hint ? (
      <div id={`${id}-hint`} className={cx("flex flex-col gap-1", FIELD_HINT)}>
        {Array.isArray(hint) ? hint.map((line: string) => <p key={line}>{line}</p>) : hint}
      </div>
    ) : null}
  </div>
);

/** A control's props with the field props optional (the label turns the field on). */
export type OptionalFieldProps = Partial<Omit<FieldProps, "id">> & { id: string };

/**
 * @function splitField
 * @param props {T} a control's props with optional field props mixed in
 * @returns {[OptionalFieldProps, Omit<T, keyof FieldProps>]} the field props, and the rest for the
 *          native control
 */
export const splitField = <T extends OptionalFieldProps>(
  props: T,
): [OptionalFieldProps, Omit<T, keyof FieldProps>] => {
  const { id, label, hint, error, required, labelStyle, hideLabel, wrapperClassName, ...rest } =
    props;
  return [{ id, label, hint, error, required, labelStyle, hideLabel, wrapperClassName }, rest];
};

/**
 * @function MaybeField
 * @param props {OptionalFieldProps & { children: ReactNode }} the field props and the control
 * @returns {JSX.Element} the control in a FormField when a label is given, bare otherwise
 */
export const MaybeField = ({
  label,
  children,
  ...field
}: OptionalFieldProps & { children: ReactNode }) =>
  label === undefined ? (
    children
  ) : (
    <FormField label={label} {...field}>
      {children}
    </FormField>
  );
