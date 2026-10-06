/**
 * @file src/components/osu/osuLinks.ts
 * @desc osu! URLs and labels from plain ids: profiles, beatmaps, set covers, the guest avatar,
 *       and slot labels ("NM1"). Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** osu!'s guest avatar, for players without one. */
export const GUEST_AVATAR = "https://osu.ppy.sh/images/layout/avatar-guest.png";

/**
 * @function profileUrl
 * @param osuId {number} an osu! user id
 * @returns {string} the user's profile URL
 */
export const profileUrl = (osuId: number): string => `https://osu.ppy.sh/users/${osuId.toString()}`;

/**
 * @function beatmapUrl
 * @param beatmapId {number} a difficulty id
 * @returns {string} the difficulty's page URL
 */
export const beatmapUrl = (beatmapId: number): string =>
  `https://osu.ppy.sh/b/${beatmapId.toString()}`;

/**
 * @function coverUrl
 * @param beatmapsetId {number} a beatmapset id
 * @returns {string} the set's cover art on osu!'s public asset host
 */
export const coverUrl = (beatmapsetId: number): string =>
  `https://assets.ppy.sh/beatmaps/${beatmapsetId.toString()}/covers/cover.jpg`;

/**
 * @function slotLabel
 * @param mod {string} a mod bucket (NM, HD, HR, DT, FM, TB)
 * @param index {number} the slot's number within the bucket
 * @returns {string} e.g. "NM1"
 */
export const slotLabel = (mod: string, index: number): string => `${mod}${index.toString()}`;
