/**
 * @file src/components/data/Toc.tsx
 * @desc In-page navigation: numbered anchor links under "On this page", wrapping on phones and a
 *       sticky rail from lg up. Pairs with Section's ids and ordinals. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { labelClasses } from "../basics/labelStyles.js";

/** One entry: the section's id, ordinal and title. */
export type TocEntry = { id: string; num?: string | undefined; title: string };

/** The entries, the landmark label and the heading text. */
export type TocProps = {
  entries: readonly TocEntry[];
  label?: string | undefined;
  heading?: string | undefined;
  className?: string | undefined;
};

/**
 * @function Toc
 * @param props {TocProps} entries, label (default "On this page"), heading (default "On this
 *        page") and className
 * @returns {JSX.Element} the nav landmark
 */
export const Toc = ({
  entries,
  label = "On this page",
  heading = "On this page",
  className,
}: TocProps) => (
  <nav aria-label={label} className={cx("lg:sticky lg:top-24", className)}>
    <p aria-hidden className={labelClasses({ tone: "fog" })}>
      {heading}
    </p>
    <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-1.5">
      {entries.map((e) => (
        <li key={e.id}>
          <a
            href={`#${e.id}`}
            className={cx(
              "group flex items-baseline gap-2 rounded-sm text-fog-300 text-sm transition hover:text-evergreen-50",
              FOCUS_RING,
            )}
          >
            {e.num ? (
              <span className="font-mono text-[10px] text-evergreen-400 tracking-[0.2em] group-hover:text-evergreen-200">
                {e.num}
              </span>
            ) : null}
            {e.num ? " " : null}
            {e.title}
          </a>
        </li>
      ))}
    </ol>
  </nav>
);
