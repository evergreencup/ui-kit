/**
 * @file src/components/layout/HeroMediaPlaceholder.tsx
 * @desc Stand-in backdrop for a PageHero whose motion graphic isn't made yet: a quiet
 *       striped Pitch panel with the edition line and the page label. Presentable if it ships,
 *       still obviously a slot to fill. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { BRAND } from "../../brand/identity.js";
import { labelClasses } from "../basics/labelStyles.js";

/** The page label and the edition line. */
export type HeroMediaPlaceholderProps = {
  label: string;
  /** The small line above the label (default "Evergreen Cup"). */
  edition?: string | undefined;
};

/**
 * @function HeroMediaPlaceholder
 * @param props {HeroMediaPlaceholderProps} label and edition
 * @returns {JSX.Element} the absolutely positioned placeholder, aria-hidden
 */
export const HeroMediaPlaceholder = ({
  label,
  edition = BRAND.name,
}: HeroMediaPlaceholderProps) => (
  <div
    aria-hidden
    className="absolute inset-0 -z-10 grid place-items-center overflow-hidden bg-evergreen-950"
  >
    <div className="diag-stripes absolute inset-0 opacity-40" />
    <div className="relative flex flex-col items-center gap-1.5 px-7 py-5">
      <span className={labelClasses({ tone: "fog", className: "font-normal tracking-[0.24em]" })}>
        {edition}
      </span>
      <span className="font-black font-display text-base text-evergreen-300/70 uppercase tracking-tight">
        {label}
      </span>
    </div>
  </div>
);
