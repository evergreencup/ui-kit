/**
 * @file src/components/layout/SiteFooter.tsx
 * @desc The site footer: a sprig strip on top, the wordmark with the tagline and socials, the
 *       link columns, then the copyright line with the legal note and the regions. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { CSSProperties, ReactNode } from "react";
import { BRAND, REGIONS } from "../../brand/identity.js";
import { cx } from "../../utils/cx.js";
import { Container } from "../basics/Container.js";
import { labelClasses } from "../basics/labelStyles.js";
import { HAIRLINE } from "../basics/panelStyles.js";
import { TextLink } from "../basics/TextLink.js";
import { SprigStripe } from "../brand/SprigStripe.js";
import { Wordmark } from "../brand/Wordmark.js";
import { byLabelLength, type NavColumn } from "./nav.js";
import { type SocialLink, SocialLinks } from "./SocialLinks.js";

/** The columns, socials and the lines under the wordmark and along the bottom. */
export type SiteFooterProps = {
  columns: readonly NavColumn[];
  socials?: readonly SocialLink[] | undefined;
  tagline?: ReactNode;
  /** The year in the copyright (default this year). */
  year?: number | undefined;
  regions?: readonly string[] | undefined;
  /** Sort each column longest label first (default true). */
  taper?: boolean | undefined;
};

/**
 * @function SiteFooter
 * @param props {SiteFooterProps} columns, socials, tagline (default the brand tagline), year,
 *        regions (default the brand's) and taper
 * @returns {JSX.Element} the contentinfo footer
 */
export const SiteFooter = ({
  columns,
  socials = [],
  tagline = BRAND.tagline,
  year = new Date().getFullYear(),
  regions = REGIONS,
  taper = true,
}: SiteFooterProps) => (
  <footer className="relative mt-auto bg-evergreen-950/80">
    <SprigStripe />
    <Container width="full" className="pt-10 pb-12">
      <div
        className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.2fr_repeat(var(--cols),1fr)]"
        style={{ "--cols": columns.length } as CSSProperties}
      >
        <div className="flex flex-col gap-4">
          <Wordmark />
          <p className="max-w-xs text-fog-300 text-sm">{tagline}</p>
          {socials.length > 0 ? <SocialLinks links={socials} /> : null}
        </div>
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h2
              className={labelClasses({
                tone: "evergreen",
                size: "md",
                className: "font-sans tracking-[0.2em]",
              })}
            >
              {col.title}
            </h2>
            <ul className="flex flex-col gap-2 text-fog-300 text-sm">
              {(taper ? byLabelLength(col.items) : col.items).map((item) => (
                <li key={item.href}>
                  <TextLink href={item.href} variant="quiet" arrow>
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className={cx(
          "mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 text-fog-300 text-xs sm:flex-row sm:items-center",
          HAIRLINE,
        )}
      >
        <p>
          © {year.toString()} {BRAND.name}. {BRAND.legal}
        </p>
        <span>{regions.join(" · ")}</span>
      </div>
    </Container>
  </footer>
);
