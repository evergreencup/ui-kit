/**
 * @file src/components/brand/Wordmark.tsx
 * @desc The Evergreen Cup wordmark: the conifer and "Evergreen Cup", the short "EGC", or the
 *       glyph alone. The text is real text, so it names itself; the icon variant takes a label.
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { BRAND } from "../../brand/identity.js";
import { cx } from "../../utils/cx.js";
import { ConiferGlyph } from "./ConiferGlyph.js";
import { WORDMARK_TEXT } from "./wordmarkStyles.js";

/** full: glyph + name, short: "EGC", icon: glyph only. */
export type WordmarkVariant = "full" | "short" | "icon";

/** The variant and extra classes. */
export type WordmarkProps = {
  variant?: WordmarkVariant | undefined;
  className?: string | undefined;
};

/**
 * @function Wordmark
 * @param props {WordmarkProps} variant (default "full") and className
 * @returns {JSX.Element} the wordmark in Mist (evergreen-50)
 */
export const Wordmark = ({ variant = "full", className }: WordmarkProps) => (
  <span
    className={cx("inline-flex items-baseline gap-2 text-evergreen-50", className)}
    {...(variant === "icon" ? { role: "img", "aria-label": BRAND.name } : {})}
  >
    {variant === "short" ? null : <ConiferGlyph className="self-center" />}
    {variant === "icon" ? null : (
      <span className={WORDMARK_TEXT}>{variant === "full" ? BRAND.name : BRAND.short}</span>
    )}
  </span>
);
