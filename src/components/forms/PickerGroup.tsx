/**
 * @file src/components/forms/PickerGroup.tsx
 * @desc The fieldset every picker (ToggleChips, ChoiceChips, OptionCards) sits in: a visually
 *       hidden legend names the group, the className lays out the options. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";

/**
 * @function PickerGroup
 * @param props {{ label: string; className: string; children: ReactNode }} the group's name,
 *        layout classes and options
 * @returns {JSX.Element} the fieldset
 */
export const PickerGroup = ({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: ReactNode;
}) => (
  <fieldset className={className}>
    <legend className="sr-only">{label}</legend>
    {children}
  </fieldset>
);
