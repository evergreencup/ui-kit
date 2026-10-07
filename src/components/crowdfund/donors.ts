/**
 * @file src/components/crowdfund/donors.ts
 * @desc The donor shape the crowdfund pieces render, and the amount line ("$25 USD"). Pure,
 *       server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { formatUsd } from "../../utils/format.js";

/** One public donation: who, how much, and what they said. Anonymous donors come named "Anonymous". */
export type Donor = {
  id: string;
  name: string;
  amountCents: number;
  /** ISO currency code shown after the amount (default "USD"). */
  currency?: string | undefined;
  /** Links the name to the osu! profile. */
  osuId?: number | null | undefined;
  avatarUrl?: string | null | undefined;
  message?: string | null | undefined;
  recurring?: boolean | undefined;
  /** When it came in, as a Date or ISO string. */
  date?: Date | string | undefined;
};

/**
 * @function donorAmount
 * @param donor {Donor} a donor
 * @returns {string} whole dollars and the currency, e.g. "$25 USD"
 */
export const donorAmount = ({ amountCents, currency = "USD" }: Donor): string =>
  `${formatUsd(amountCents)} ${currency}`;
