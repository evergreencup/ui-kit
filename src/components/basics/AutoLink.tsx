/**
 * @file src/components/basics/AutoLink.tsx
 * @desc A link that picks its element from the href: next/link for paths inside the app, a
 *       plain <a> for an off-site URL, with rel="noreferrer" when it opens a new tab. Every
 *       link-shaped component in the kit renders it. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import Link from "next/link.js";
import type { ComponentProps } from "react";
import { isExternalHref } from "../../utils/href.js";

/** Native anchor props with a required string href. */
export type AutoLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  /** Open in a new tab. Defaults to true for an external href. */
  newTab?: boolean | undefined;
};

/**
 * @function AutoLink
 * @param props {AutoLinkProps} href, newTab and native anchor props
 * @returns {JSX.Element} next/link for internal paths, a plain `<a>` otherwise
 */
export const AutoLink = ({ href, newTab, rel, ...props }: AutoLinkProps) => {
  const external = isExternalHref(href);
  const blank = newTab ?? external;
  const tabProps = blank ? { target: "_blank", rel: rel ?? "noreferrer" } : { rel };
  return external ? (
    <a href={href} {...tabProps} {...props} />
  ) : (
    <Link href={href} {...tabProps} {...(props as Omit<ComponentProps<typeof Link>, "href">)} />
  );
};
