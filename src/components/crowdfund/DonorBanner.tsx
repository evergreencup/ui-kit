/**
 * @file src/components/crowdfund/DonorBanner.tsx
 * @desc A donation banner in the page: the variant's art with the donor's name (uppercased,
 *       "DONOR" when blank) and an optional subtitle over it, scaled to the banner's width with
 *       container units. The site's next/og route renders the same look as a PNG. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { CSSProperties } from "react";
import { cx } from "../../utils/cx.js";
import {
  type BannerTextStyle,
  DONOR_BANNER_LIMITS,
  DONOR_BANNER_SIZE,
  type DonorBannerVariant,
  sanitizeBannerText,
} from "./bannerVariants.js";

/** The name, subtitle, look and classes. */
export type DonorBannerProps = {
  name: string;
  subtitle?: string | null | undefined;
  variant: DonorBannerVariant;
  className?: string | undefined;
};

// Native px to a share of the banner's width, so the text scales with it.
const cqw = (px: number) => `${((px / DONOR_BANNER_SIZE.width) * 100).toFixed(3)}cqw`;

const textStyle = (s: BannerTextStyle): CSSProperties => ({
  color: s.color,
  fontSize: cqw(s.size),
  letterSpacing: cqw(s.letterSpacing),
  textShadow: s.shadow || undefined,
});

/**
 * @function DonorBanner
 * @param props {DonorBannerProps} name, subtitle, variant and className
 * @returns {JSX.Element} the banner as a figure-like image with the name as its label
 */
export const DonorBanner = ({ name, subtitle, variant, className }: DonorBannerProps) => {
  const shown = sanitizeBannerText(name, DONOR_BANNER_LIMITS.name).toUpperCase() || "DONOR";
  const sub = subtitle ? sanitizeBannerText(subtitle, DONOR_BANNER_LIMITS.subtitle) : "";
  return (
    <div
      role="img"
      aria-label={
        sub ? `${variant.label} banner: ${shown}, ${sub}` : `${variant.label} banner: ${shown}`
      }
      className={cx("@container relative w-full overflow-hidden rounded-sm", className)}
      style={{
        aspectRatio: `${DONOR_BANNER_SIZE.width.toString()} / ${DONOR_BANNER_SIZE.height.toString()}`,
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: the art is any URL the app hosts */}
      <img src={variant.src} alt="" className="absolute inset-0 size-full object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `translateY(${cqw(variant.offsetY)})` }}
      >
        <div className="relative flex font-display font-extrabold" style={textStyle(variant.name)}>
          {shown}
          {sub ? (
            <div
              className="absolute top-full left-1/2 mt-[1cqw] flex -translate-x-1/2 whitespace-nowrap"
              style={textStyle(variant.subtitle)}
            >
              {sub}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
