/**
 * @file src/components/crowdfund/bannerVariants.ts
 * @desc Donation banner data: the 620x197 template size, the text styles a variant overlays,
 *       the classic white-on-skyline preset, and the sanitizer for names and subtitles. The art
 *       itself is never in the kit: each variant carries its template's URL. Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** The template's native size; text sizes are in px at this size. */
export const DONOR_BANNER_SIZE = { width: 620, height: 197 } as const;

/** The longest name and subtitle a banner prints. */
export const DONOR_BANNER_LIMITS = { name: 22, subtitle: 40 } as const;

/** How one line of banner text looks. */
export type BannerTextStyle = {
  color: string;
  /** px at the native 620x197 size; scales with the banner's width. */
  size: number;
  letterSpacing: number;
  /** CSS text-shadow; empty for none. */
  shadow: string;
};

/** One banner look over its background art. */
export type DonorBannerVariant = {
  id: string;
  label: string;
  /** The background art's URL (the app hosts it). */
  src: string;
  /** Shift of the text block from dead center in native px, negative is up. */
  offsetY: number;
  name: BannerTextStyle;
  subtitle: BannerTextStyle;
};

/** The classic look: white name and pale subtitle with a heavy drop shadow. */
export const CLASSIC_BANNER_STYLE: Omit<DonorBannerVariant, "id" | "label" | "src"> = {
  offsetY: -16,
  name: {
    color: "#ffffff",
    size: 56,
    letterSpacing: 3,
    shadow: "0 4px 10px rgba(0,0,0,0.6), 0 2px 3px rgba(0,0,0,0.7), 0 1px 0 rgba(0,0,0,0.8)",
  },
  subtitle: {
    color: "#e8f2ff",
    size: 15,
    letterSpacing: 5,
    shadow: "0 2px 6px rgba(0,0,0,0.6), 0 1px 0 rgba(0,0,0,0.7)",
  },
};

/**
 * @function sanitizeBannerText
 * @param value {string} raw text
 * @param max {number} the most characters kept
 * @returns {string} printable characters only (control characters and newlines dropped),
 *          trimmed and cut to max
 */
export const sanitizeBannerText = (value: string, max: number): string => {
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) as number;
    if (code >= 32 && code !== 127) out += ch;
  }
  return out.trim().slice(0, max);
};
