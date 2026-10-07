/**
 * @file src/components/forms/Select.tsx
 * @desc Client listbox select: a combobox button opening a themed option list (the native popup
 *       ignores the palette). Arrow keys, Home, End, Enter, Space, Escape and Tab work; a click
 *       outside closes it; a hidden input carries the value into a form. Labeled through FormField
 *       when given a `label`.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

"use client";

import { type KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useDismiss.js";
import { cx } from "../../utils/cx.js";
import { CheckIcon, ChevronDownIcon } from "../icons/icons.js";
import { fieldControlProps, MaybeField, type OptionalFieldProps } from "./FormField.js";
import { type FieldVariant, fieldClasses } from "./fieldStyles.js";
import { listboxKey, OPEN_KEYS } from "./selectKeys.js";

/** One choice. */
export type SelectOption = { value: string; label: string };

/** The controlled value, options and handler, plus the field props. */
export type SelectProps = OptionalFieldProps & {
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  /** Form field name for the hidden input. */
  name?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  /** Accessible name when there is no visible label. */
  "aria-label"?: string | undefined;
  variant?: FieldVariant | undefined;
  className?: string | undefined;
};

/**
 * @function Select
 * @param props {SelectProps} value, options, onChange, name, placeholder (default "Select…"),
 *        disabled, aria-label, variant (default "boxed"), className and field props
 * @returns {JSX.Element} the select
 */
export const Select = ({
  value,
  options,
  onChange,
  name,
  placeholder = "Select…",
  disabled = false,
  "aria-label": ariaLabel,
  variant = "boxed",
  className,
  ...field
}: SelectProps) => {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const selected = Math.max(
    options.findIndex((o) => o.value === value),
    0,
  );
  const [focused, setFocused] = useState(selected);
  const root = useRef<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const list = useRef<HTMLDivElement | null>(null);
  const close = useCallback(() => {
    setOpen(false);
  }, []);
  // The list unmounts on close, so a keyboard or option close hands focus back to the trigger.
  const closeToTrigger = (): void => {
    setOpen(false);
    trigger.current?.focus();
  };
  useOutsideClick(root, open, close);

  useEffect(() => {
    if (open) list.current?.focus();
  }, [open]);
  useEffect(() => {
    if (open)
      document
        .getElementById(`${listId}-${focused.toString()}`)
        ?.scrollIntoView?.({ block: "nearest" });
  }, [open, focused, listId]);

  const show = (): void => {
    setFocused(selected);
    setOpen(true);
  };
  const commit = (index: number): void => {
    const option = options[index];
    if (option) onChange(option.value);
    closeToTrigger();
  };
  const onListKey = (event: KeyboardEvent<HTMLDivElement>): void => {
    const action = listboxKey(event.key, focused, options.length);
    if (action.type === "none") return;
    // Tab keeps its default, so focus moves on from the trigger to the next control.
    if (event.key !== "Tab") event.preventDefault();
    if (action.type === "move") setFocused(action.index);
    else if (action.type === "commit") commit(focused);
    else closeToTrigger();
  };
  const current = options.find((o) => o.value === value);

  return (
    <MaybeField
      {...field}
      label={
        // A button can't take aria-required, so the name says it; the asterisk is aria-hidden.
        field.required && field.label !== undefined ? (
          <>
            {field.label}
            <span className="sr-only">{" (required)"}</span>
          </>
        ) : (
          field.label
        )
      }
    >
      <div ref={root} className={cx("relative", className)}>
        {name ? <input type="hidden" name={name} value={value} /> : null}
        <button
          ref={trigger}
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          {...fieldControlProps(field)}
          onClick={() => {
            if (open) close();
            else show();
          }}
          onKeyDown={(event) => {
            if (!OPEN_KEYS.has(event.key)) return;
            event.preventDefault();
            show();
          }}
          className={fieldClasses(
            variant,
            Boolean(field.error),
            "flex items-center justify-between gap-2 text-left focus-visible:border-evergreen-400",
          )}
        >
          <span className={current ? undefined : "text-fog-500"}>
            {current?.label ?? placeholder}
          </span>
          <ChevronDownIcon
            className={cx("size-3 text-evergreen-400 transition-transform", open && "rotate-180")}
          />
        </button>
        {open ? (
          <div
            id={listId}
            ref={list}
            role="listbox"
            tabIndex={-1}
            aria-label={field.label === undefined ? ariaLabel : undefined}
            aria-labelledby={field.label === undefined ? undefined : `${field.id}-label`}
            aria-activedescendant={`${listId}-${focused.toString()}`}
            onKeyDown={onListKey}
            className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-evergreen-700/70 bg-evergreen-950 py-1 shadow-xl focus:outline-hidden"
          >
            {options.map((option, i) => (
              // biome-ignore lint/a11y/useFocusableInteractive: options take focus through aria-activedescendant
              // biome-ignore lint/a11y/useKeyWithClickEvents: the listbox handles the keys for every option
              <div
                key={option.value}
                id={`${listId}-${i.toString()}`}
                role="option"
                aria-selected={option.value === value}
                onClick={(event) => {
                  // Inside a <label>, an uncancelled click would reach the trigger and reopen it.
                  event.preventDefault();
                  commit(i);
                }}
                onMouseEnter={() => {
                  setFocused(i);
                }}
                className={cx(
                  "flex cursor-pointer items-center justify-between px-3 coarse:py-3 py-1.5 font-mono text-fog-200 text-sm",
                  option.value === value && "text-evergreen-200",
                  i === focused && "bg-evergreen-800/80 text-evergreen-50",
                )}
              >
                {option.label}
                {option.value === value ? (
                  <CheckIcon className="ml-2 size-3.5 text-evergreen-400" />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </MaybeField>
  );
};
