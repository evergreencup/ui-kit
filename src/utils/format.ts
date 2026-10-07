/**
 * @file src/utils/format.ts
 * @desc Display formatters the cup's pages share: whole-dollar USD from cents, m:ss lengths,
 *       counted nouns, zero-padded counters, percentages and short dates. Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/**
 * @function formatUsd
 * @param cents {number} an amount in US cents
 * @returns {string} whole dollars with thousands separators, e.g. "$1,250"
 */
export const formatUsd = (cents: number): string =>
  `$${Math.round(cents / 100).toLocaleString("en-US")}`;

/**
 * @function formatMmSs
 * @param seconds {number} a length in seconds
 * @returns {string} "m:ss", e.g. 95 is "1:35" (partial seconds drop)
 */
export const formatMmSs = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60).toString()}:${(total % 60).toString().padStart(2, "0")}`;
};

/**
 * @function plural
 * @param n {number} the count
 * @param word {string} the singular noun
 * @param pluralWord {string} the plural (default word + "s")
 * @returns {string} e.g. "1 hour", "3 hours"
 */
export const plural = (n: number, word: string, pluralWord = `${word}s`): string =>
  `${n.toString()} ${n === 1 ? word : pluralWord}`;

/**
 * @function padCount
 * @param n {number} a count
 * @param width {number} digits (default 3)
 * @returns {string} the count zero-padded, e.g. 7 is "007"
 */
export const padCount = (n: number, width = 3): string => n.toString().padStart(width, "0");

/**
 * @function percentOf
 * @param value {number} the part
 * @param total {number} the whole
 * @returns {number} value / total as 0 to 100, clamped; 0 when total is not positive
 */
export const percentOf = (value: number, total: number): number =>
  total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;

/**
 * @function formatShortDate
 * @param date {Date | string} a date, or an ISO string ("2026-10-06" is read as that UTC day)
 * @returns {string} month and day in UTC, e.g. "Oct 6"
 */
export const formatShortDate = (date: Date | string): string =>
  new Date(
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00Z` : date,
  ).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
