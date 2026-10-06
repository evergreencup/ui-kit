/**
 * @file src/components/basics/TextLink.tsx
 * @desc A text link in the inline (underlined) or quiet style, through AutoLink. External
 *       links can show a trailing arrow. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { isExternalHref } from "../../utils/href.js";
import { AutoLink, type AutoLinkProps } from "./AutoLink.js";
import { LINK_CLASSES, type LinkVariant } from "./linkStyles.js";

/** AutoLink props, plus the variant and whether to mark external links with an arrow. */
export type TextLinkProps = AutoLinkProps & {
  variant?: LinkVariant | undefined;
  /** Append " ↗" to an external link (default false). */
  arrow?: boolean | undefined;
};

/**
 * @function TextLink
 * @param props {TextLinkProps} href, variant (default "inline"), arrow and native anchor props
 * @returns {JSX.Element} the styled link
 */
export const TextLink = ({
  variant = "inline",
  arrow = false,
  className,
  children,
  ...props
}: TextLinkProps) => (
  <AutoLink className={cx(LINK_CLASSES[variant], className)} {...props}>
    {children}
    {arrow && isExternalHref(props.href) ? <span aria-hidden> ↗</span> : null}
  </AutoLink>
);
