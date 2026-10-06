/**
 * @file src/components/brand/PaletteGrid.tsx
 * @desc One palette's swatches under its name and description, from the brand data.
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { PALETTE_INFO, type PaletteName, swatches } from "../../brand/palette.js";
import { DisplayHeading, type HeadingLevel } from "../basics/DisplayHeading.js";
import { SwatchTile } from "./SwatchTile.js";

/** The palette and its heading level. */
export type PaletteGridProps = { name: PaletteName; level?: HeadingLevel | undefined };

/**
 * @function PaletteGrid
 * @param props {PaletteGridProps} the palette name and heading level (default 3)
 * @returns {JSX.Element} the palette section
 */
export const PaletteGrid = ({ name, level = 3 }: PaletteGridProps) => {
  const info = PALETTE_INFO[name];
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <DisplayHeading level={level} size="md" className="text-2xl">
          {info.label}
        </DisplayHeading>
        <p className="max-w-2xl text-fog-300 text-sm">{info.description}</p>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {swatches(name).map((s) => (
          <SwatchTile key={s.token} hex={s.hex} token={s.token} label={s.step} />
        ))}
      </div>
    </section>
  );
};
