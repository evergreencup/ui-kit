/**
 * @file src/components/basics/ButtonLink.tsx
 * @desc A link styled as a button (calls to action, "Donate on Ko-fi"). Picks next/link or a
 *       plain anchor through AutoLink. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { AutoLink, type AutoLinkProps } from "./AutoLink.js";
import { type ButtonClassOptions, buttonClasses } from "./buttonStyles.js";

/** AutoLink props, plus the button's variant, size and pill shape. */
export type ButtonLinkProps = AutoLinkProps & Omit<ButtonClassOptions, "className">;

/**
 * @function ButtonLink
 * @param props {ButtonLinkProps} href, variant, size, pill and native anchor props
 * @returns {JSX.Element} the link with button classes
 */
export const ButtonLink = ({ variant, size, pill, className, ...props }: ButtonLinkProps) => (
  <AutoLink className={buttonClasses({ variant, size, pill, className })} {...props} />
);
