/**
 * @file src/components/layout/ComingSoon.tsx
 * @desc The pre-announcement landing block: the kicker, the cup's name as the page's h1, and a
 *       status line, centered in the page. Defaults come from the brand. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { BRAND } from "../../brand/identity.js";
import { cx } from "../../utils/cx.js";
import { Eyebrow } from "../basics/Eyebrow.js";
import { headingClasses } from "../basics/headingStyles.js";

/** The copy, any actions, and classes. */
export type ComingSoonProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  /** Links or buttons under the lead. */
  children?: ReactNode;
  className?: string | undefined;
  /** The element (default main; pick section inside a page that has its own main). */
  as?: "main" | "section" | "div" | undefined;
};

/**
 * @function ComingSoon
 * @param props {ComingSoonProps} eyebrow (default BRAND.kicker), title (default BRAND.name),
 *        lead (default "Announcement coming soon."), children, className and as (default main)
 * @returns {JSX.Element} the centered block
 */
export const ComingSoon = ({
  eyebrow = BRAND.kicker,
  title = BRAND.name,
  lead = "Announcement coming soon.",
  children,
  className,
  as: Element = "main",
}: ComingSoonProps) => (
  <Element
    className={cx(
      "flex flex-1 flex-col items-center justify-center gap-4 px-8 py-24 text-center",
      className,
    )}
  >
    <Eyebrow as="p" tone="evergreen" className="font-sans text-sm tracking-[0.25em]">
      {eyebrow}
    </Eyebrow>
    <h1 className={headingClasses("hero")}>{title}</h1>
    <p className="max-w-md text-base text-fog-300">{lead}</p>
    {children ? <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div> : null}
  </Element>
);
