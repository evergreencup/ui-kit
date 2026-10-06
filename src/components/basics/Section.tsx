/**
 * @file src/components/basics/Section.tsx
 * @desc An anchored page section: an optional mono ordinal that links to itself, a display
 *       title over a hairline, an optional lead, and a stacked body. scroll-mt clears the sticky
 *       header after a #anchor jump. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { DisplayHeading, type HeadingLevel } from "./DisplayHeading.js";
import { FOCUS_RING } from "./focusStyles.js";
import type { HeadingSize } from "./headingStyles.js";
import { HAIRLINE } from "./panelStyles.js";

/** Native section props, plus the anchor id, ordinal, title, lead and heading level and size. */
export type SectionProps = Omit<ComponentProps<"section">, "title"> & {
  id: string;
  title: ReactNode;
  /** A mono ordinal like "03" before the title, linking to the section. */
  num?: string | undefined;
  lead?: ReactNode | undefined;
  /** Heading level (default 2). */
  level?: HeadingLevel | undefined;
  /** Heading size (default "lg"). */
  size?: HeadingSize | undefined;
  /** Draw the hairline under the header (default true). */
  rule?: boolean | undefined;
};

/**
 * @function Section
 * @param props {SectionProps} id, title, num, lead, level, size, rule, body and native props
 * @returns {JSX.Element} the deep-linkable section
 */
export const Section = ({
  id,
  title,
  num,
  lead,
  level = 2,
  size,
  rule = true,
  className,
  children,
  ...props
}: SectionProps) => (
  <section id={id} className={cx("flex scroll-mt-24 flex-col gap-5", className)} {...props}>
    <header className={cx("flex flex-col gap-2", rule && `${HAIRLINE} border-b pb-3`)}>
      <div className="flex flex-wrap items-baseline gap-3">
        {num ? (
          <a
            href={`#${id}`}
            className={`rounded-sm font-mono font-semibold text-evergreen-300 text-xs tracking-[0.24em] transition hover:text-evergreen-100 ${FOCUS_RING}`}
          >
            <span className="sr-only">Section {num}</span>
            <span aria-hidden>{num}</span>
          </a>
        ) : null}
        <DisplayHeading level={level} size={size}>
          {title}
        </DisplayHeading>
      </div>
      {lead ? <p className="max-w-2xl text-fog-300 text-sm">{lead}</p> : null}
    </header>
    <div className="flex flex-col gap-4">{children}</div>
  </section>
);
