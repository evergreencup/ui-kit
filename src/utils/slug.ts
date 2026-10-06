/**
 * @file src/utils/slug.ts
 * @desc Heading slugs for deep links: lowercase, "&" spelled out, runs of anything else to one
 *       hyphen. Pure.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/**
 * @function slugify
 * @param text {string} heading text
 * @returns {string} a kebab-case id, e.g. "Photography & recording" is "photography-and-recording"
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
