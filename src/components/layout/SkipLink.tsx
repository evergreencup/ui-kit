/**
 * @file src/components/layout/SkipLink.tsx
 * @desc The skip link: hidden until keyboard focus, then a button-styled link pinned to the top
 *       left that jumps past the header to the page's main content. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { ReactNode } from "react";
import { buttonClasses } from "../basics/buttonStyles.js";

/** Where it jumps and what it says. */
export type SkipLinkProps = {
  /** The main content's fragment (default "#main"); give that element the matching id. */
  href?: string | undefined;
  children?: ReactNode;
};

/**
 * @function SkipLink
 * @param props {SkipLinkProps} href and children (default "Skip to content")
 * @returns {JSX.Element} the visually hidden link that shows on focus
 */
export const SkipLink = ({ href = "#main", children = "Skip to content" }: SkipLinkProps) => (
  <a
    href={href}
    className={buttonClasses({
      size: "md",
      className: "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60",
    })}
  >
    {children}
  </a>
);
