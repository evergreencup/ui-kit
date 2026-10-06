/**
 * @file src/components/brand/TypeSpecimen.tsx
 * @desc A type family's specimen card: the family name, a sample set in it, and its usage
 *       notes. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { BrandFont, FontRole } from "../../brand/identity.js";
import { panelClasses } from "../basics/panelStyles.js";

const SAMPLE: Record<FontRole, string> = {
  display: "font-black font-display text-6xl text-evergreen-50 tracking-[-0.035em]",
  sans: "text-evergreen-50 text-lg leading-relaxed",
  mono: "font-mono text-base text-evergreen-50",
};

/**
 * @function TypeSpecimen
 * @param props {{ font: BrandFont }} one entry of the brand's FONTS
 * @returns {JSX.Element} the specimen card
 */
export const TypeSpecimen = ({ font }: { font: BrandFont }) => (
  <article className={panelClasses({ padding: "xl", className: "flex flex-col gap-4 sm:p-6" })}>
    <header className="flex flex-col gap-1 border-evergreen-800/60 border-b pb-3">
      <span className="font-bold font-display text-evergreen-50 text-xl">{font.family}</span>
      <span className="font-mono text-fog-500 text-xs">{font.weights.join(" · ")}</span>
    </header>
    <p className={SAMPLE[font.role]}>{font.sample}</p>
    <p className="text-fog-300 text-sm">{font.notes}</p>
  </article>
);
