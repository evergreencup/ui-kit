/**
 * @file src/components/basics/Highlight.tsx
 * @desc An inline bark highlight for words that must not be missed ("Signups close Oct 4").
 *       A <strong>, so it reads as important. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { cx } from "../../utils/cx.js";

/**
 * @function Highlight
 * @param props {ComponentProps<"strong">} native strong props
 * @returns {JSX.Element} the highlighted run of text
 */
export const Highlight = ({ className, ...props }: ComponentProps<"strong">) => (
  <strong
    className={cx(
      "whitespace-nowrap rounded-sm bg-bark-500/25 px-1.5 py-0.5 font-semibold text-bark-100",
      className,
    )}
    {...props}
  />
);
