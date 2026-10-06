/**
 * @file src/components/layout/nav.ts
 * @desc The navigation data types and the one active-route rule the header, the mobile menu and
 *       NavLink share. Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** One nav entry. An external href opens in a new tab with an arrow. */
export type NavItem = { href: string; label: string; description?: string | undefined };

/** A footer column: a heading over a list of links. */
export type NavColumn = { title: string; items: readonly NavItem[] };

/**
 * @function isActivePath
 * @param pathname {string} the current path
 * @param href {string} a nav entry's href
 * @returns {boolean} true on the entry's own page and its sub-pages ("/" matches only itself)
 */
export const isActivePath = (pathname: string, href: string): boolean =>
  pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

/**
 * @function byLabelLength
 * @param items {readonly NavItem[]} entries
 * @returns {NavItem[]} a copy, longest label first, so a footer column reads as a clean taper
 */
export const byLabelLength = (items: readonly NavItem[]): NavItem[] =>
  [...items].sort((a, b) => b.label.length - a.label.length);
