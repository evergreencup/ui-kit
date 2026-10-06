/**
 * @file src/components/layout/NavLink.tsx
 * @desc Client link that marks itself as the current page (aria-current and the growing
 *       underline) when the route matches, through next/navigation's usePathname. Carries the focus
 *       ring.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { usePathname } from "next/navigation.js";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { AutoLink } from "../basics/AutoLink.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { isActivePath } from "./nav.js";

/** The target, label and the classes for each state. */
export type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string | undefined;
  activeClassName?: string | undefined;
  inactiveClassName?: string | undefined;
  /** Draw the growing underline on the current page (default true). */
  underline?: boolean | undefined;
};

/**
 * @function NavLink
 * @param props {NavLinkProps} href, children, className, activeClassName (default
 *        text-evergreen-50), inactiveClassName (default fog with an evergreen hover), underline
 * @returns {JSX.Element} the link, aria-current="page" when active
 */
export const NavLink = ({
  href,
  children,
  className,
  activeClassName = "text-evergreen-50",
  inactiveClassName = "text-fog-300 hover:text-evergreen-100",
  underline = true,
}: NavLinkProps) => {
  const active = isActivePath(usePathname(), href);
  return (
    <AutoLink
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "relative rounded-sm",
        FOCUS_RING,
        className,
        active ? activeClassName : inactiveClassName,
        active && underline && "active-underline",
      )}
    >
      {children}
    </AutoLink>
  );
};
