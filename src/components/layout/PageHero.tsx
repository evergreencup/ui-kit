/**
 * @file src/components/layout/PageHero.tsx
 * @desc The page header band: an eyebrow, the display title, a lead, optional actions, over a
 *       backdrop (a HeroVideo or placeholder via `media`, or a quiet cascade gradient). `tall` anchors the copy low for full-scene video. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { Container } from "../basics/Container.js";
import { Eyebrow } from "../basics/Eyebrow.js";
import { headingClasses } from "../basics/headingStyles.js";
import type { LabelTone } from "../basics/labelStyles.js";
import { HAIRLINE } from "../basics/panelStyles.js";

/** The copy, actions, backdrop and size. */
export type PageHeroProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  eyebrowTone?: LabelTone | undefined;
  lead?: ReactNode;
  /** Buttons or links in a wrapping row under the lead. */
  children?: ReactNode;
  /** An absolutely positioned backdrop (HeroVideo, HeroMediaPlaceholder). */
  media?: ReactNode;
  size?: "default" | "tall" | undefined;
};

const SIZES = {
  default: "py-20 sm:py-24",
  tall: "min-h-[24rem] justify-end py-16 sm:min-h-[30rem] sm:py-20",
} as const;

/**
 * @function PageHero
 * @param props {PageHeroProps} title, eyebrow, eyebrowTone (default "evergreen"), lead, children,
 *        media and size (default "default")
 * @returns {JSX.Element} the hero section, its title the page's h1
 */
export const PageHero = ({
  title,
  eyebrow,
  eyebrowTone = "evergreen",
  lead,
  children,
  media,
  size = "default",
}: PageHeroProps) => (
  <section className={cx("relative isolate flex flex-col overflow-hidden border-b", HAIRLINE)}>
    {media ?? (
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-cascade-900/30 via-evergreen-950 to-evergreen-950"
      />
    )}
    <Container className={cx("relative z-10 flex flex-col gap-4", SIZES[size])}>
      {eyebrow ? (
        <Eyebrow as="p" tone={eyebrowTone} className="font-sans text-xs tracking-[0.25em]">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h1 className={headingClasses("hero")}>{title}</h1>
      {lead ? <p className="max-w-2xl text-base text-fog-300 sm:text-lg">{lead}</p> : null}
      {children ? <div className="mt-2 flex flex-wrap gap-3">{children}</div> : null}
    </Container>
  </section>
);
