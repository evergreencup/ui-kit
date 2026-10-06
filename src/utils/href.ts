/**
 * @file src/utils/href.ts
 * @desc Link helpers: whether an href leaves the app (a scheme or //host).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/**
 * @function isExternalHref
 * @param href {string} a link target
 * @returns {boolean} true for a URL with a scheme (https:, mailto:) or a protocol-relative //host
 */
export const isExternalHref = (href: string): boolean =>
  /^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("//");
