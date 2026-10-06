/**
 * @file src/components/brand/BrandKit.tsx
 * @desc The whole brand page body from the brand data: core colors, every palette, surfaces
 *       and text, type, and the lockups, each an anchored Section. Optional slots go after the
 *       lockups (a plain-text handoff link, contact). Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { FONTS } from "../../brand/identity.js";
import { CORE_COLORS, PALETTE_ORDER, SEMANTIC_TOKENS } from "../../brand/palette.js";
import { Section } from "../basics/Section.js";
import { Lockup } from "./Lockup.js";
import { PaletteGrid } from "./PaletteGrid.js";
import { SwatchTile } from "./SwatchTile.js";
import { TokenRow } from "./TokenRow.js";
import { TypeSpecimen } from "./TypeSpecimen.js";

/** Content to append after the brand sections. */
export type BrandKitProps = { children?: ReactNode };

/**
 * @function BrandKit
 * @param props {BrandKitProps} extra sections to render last
 * @returns {JSX.Element} the brand sections stacked with generous gaps
 */
export const BrandKit = ({ children }: BrandKitProps) => (
  <div className="flex flex-col gap-16">
    <Section
      id="core"
      title="Core colors"
      size="xl"
      rule={false}
      lead="The five colors every surface starts from."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CORE_COLORS.map((c) => (
          <SwatchTile
            key={c.token}
            hex={c.hex}
            token={c.token}
            label={c.name}
            usage={c.usage}
            size="lg"
          />
        ))}
      </div>
    </Section>
    <Section
      id="color"
      title="Color"
      size="xl"
      rule={false}
      lead="Evergreen and Cascade do the heavy lifting. Bark, Moss, Fog and Rain fill out the world."
    >
      {PALETTE_ORDER.map((name) => (
        <PaletteGrid key={name} name={name} />
      ))}
    </Section>
    <Section
      id="surfaces"
      title="Surfaces & text"
      size="xl"
      rule={false}
      lead="How the colors combine on a typical page."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SEMANTIC_TOKENS.map((t) => (
          <TokenRow key={t.token} color={t} />
        ))}
      </div>
    </Section>
    <Section
      id="type"
      title="Type"
      size="xl"
      rule={false}
      lead="Three families. Display sets the tone, body keeps reading easy, mono keeps numbers tidy."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {FONTS.map((f) => (
          <TypeSpecimen key={f.role} font={f} />
        ))}
      </div>
    </Section>
    <Section
      id="lockups"
      title="Lockups"
      size="xl"
      rule={false}
      lead="The wordmark over the PNW arrows."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Lockup variant="chevrons" />
        <Lockup variant="compass" />
      </div>
    </Section>
    {children}
  </div>
);
