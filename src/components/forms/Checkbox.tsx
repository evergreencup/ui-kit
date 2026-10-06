/**
 * @file src/components/forms/Checkbox.tsx
 * @desc A checkbox inside its own bordered label row, so the whole row is the target.
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

/** Native checkbox props, plus the label. */
export type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  id: string;
  label: ReactNode;
};

/**
 * @function Checkbox
 * @param props {CheckboxProps} id, label and native input props (className goes on the row)
 * @returns {JSX.Element} the labeled checkbox row
 */
export const Checkbox = ({ id, label, className, ...props }: CheckboxProps) => (
  <label
    htmlFor={id}
    className={cx(
      "flex cursor-pointer items-center gap-3 rounded-sm border border-evergreen-800/70 bg-evergreen-950/40 px-3 coarse:py-3.5 py-2.5 text-evergreen-100 text-sm transition hover:border-evergreen-500/60 has-disabled:cursor-not-allowed has-disabled:opacity-60 has-focus-visible:ring-2 has-focus-visible:ring-evergreen-400",
      className,
    )}
  >
    <input
      {...props}
      id={id}
      type="checkbox"
      className="size-4 shrink-0 rounded-sm border border-evergreen-700 bg-evergreen-950 accent-evergreen-400 focus:outline-none"
    />
    <span>{label}</span>
  </label>
);
