/**
 * @file src/components/basics/Eyebrow.tsx
 * @desc A mono uppercase label: the eyebrow over a heading, a stat caption, a status line.
 *       A span by default, or a p. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { type LabelClassOptions, labelClasses } from "./labelStyles.js";

/** Native span props, plus the label's tone and size and the element (span or p). */
export type EyebrowProps = Omit<ComponentProps<"span">, "ref"> &
  Omit<LabelClassOptions, "className"> & { as?: "span" | "p" | undefined };

/**
 * @function Eyebrow
 * @param props {EyebrowProps} tone (default "moss"), size (default "sm"), element and native props
 * @returns {JSX.Element} the label
 */
export const Eyebrow = ({
  as: Element = "span",
  tone,
  size,
  className,
  ...props
}: EyebrowProps) => <Element className={labelClasses({ tone, size, className })} {...props} />;
