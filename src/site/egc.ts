/**
 * @file src/site/egc.ts
 * @desc evergreencup.org's own site data, ready for SiteHeader, SiteFooter and SocialLinks: the
 *       main nav, the register call to action, the footer columns, the community links and the
 *       social accounts. Import from "@evergreencup/ui-kit/site"; override any piece per page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import {
  BracketIcon,
  DiscordIcon,
  KofiIcon,
  OsuIcon,
  TwitchIcon,
  YouTubeIcon,
} from "../components/icons/icons.js";
import type { NavColumn, NavItem } from "../components/layout/nav.js";
import type { SocialLink } from "../components/layout/SocialLinks.js";

/** The public community Discord (never the staff server). */
export const DISCORD_INVITE_URL = "https://discord.gg/5p9XtDN52a";

/** The cup's Ko-fi: the donate button and the footer icon both point here. */
export const KOFI_URL = "https://ko-fi.com/egc26";

/** The bracket on Challonge. */
export const CHALLONGE_URL = "https://challonge.com/fdwlqwq6";

/** The header nav, in order. */
export const MAIN_NAV: readonly NavItem[] = [
  { href: "/rules", label: "Rules", description: "Format, mod buckets, and match procedure" },
  { href: "/pools", label: "Pools", description: "Mappools by round" },
  { href: "/schedule", label: "Schedule", description: "Match times across rounds" },
  { href: "/teams", label: "Teams", description: "Rosters, captains, seeds" },
  { href: "/lan", label: "LAN", description: "Grand Finals weekend in Federal Way, WA" },
  { href: "/crowdfund", label: "Donate", description: "Fund the prize pool and LAN costs" },
];

/** The soundtrack entry, added once a track is public. */
export const SOUNDTRACK_NAV: NavItem = {
  href: "/soundtrack",
  label: "Soundtrack",
  description: "Original tracks commissioned for the edition",
};

/** The header's call to action. */
export const CTA_NAV: NavItem = {
  href: "/register",
  label: "Register",
  description: "Sign up to play or staff this edition",
};

/** The account entry for signed-out and signed-in visitors. */
export const ACCOUNT_NAV = {
  signedOut: { href: "/signin", label: "Sign in" },
  signedIn: { href: "/dashboard", label: "Dashboard" },
} as const satisfies Record<string, NavItem>;

/**
 * @function insertBefore
 * @param items {readonly NavItem[]} a nav list
 * @param beforeHref {string} the entry to insert in front of (appends when absent)
 * @param item {NavItem} the new entry
 * @returns {NavItem[]} a new list with the entry in place
 */
export const insertBefore = (
  items: readonly NavItem[],
  beforeHref: string,
  item: NavItem,
): NavItem[] => {
  const at = items.findIndex((i) => i.href === beforeHref);
  return at === -1 ? [...items, item] : [...items.slice(0, at), item, ...items.slice(at)];
};

/**
 * @function mainNav
 * @param opts {{ soundtrack?: boolean }} whether the soundtrack page is live
 * @returns {readonly NavItem[]} the header nav, with Soundtrack before Donate when live
 */
export const mainNav = ({
  soundtrack = false,
}: {
  soundtrack?: boolean;
} = {}): readonly NavItem[] =>
  soundtrack ? insertBefore(MAIN_NAV, "/crowdfund", SOUNDTRACK_NAV) : MAIN_NAV;

/** The footer's link columns. */
export const FOOTER_COLUMNS: readonly NavColumn[] = [
  {
    title: "Tournament",
    items: [
      { href: "/schedule", label: "Schedule" },
      { href: "/teams", label: "Teams" },
      { href: "/rules", label: "Rules" },
      { href: "/pools", label: "Pools" },
      { href: "/lan", label: "LAN" },
    ],
  },
  {
    title: "Community",
    items: [
      { href: "/contributors", label: "Contributors" },
      { href: "/stream", label: "Stream" },
    ],
  },
  {
    title: "Support",
    items: [
      { href: "/register", label: "Register" },
      { href: "/crowdfund", label: "Donate" },
    ],
  },
  {
    title: "About",
    items: [
      { href: "/about/disclaimers", label: "Disclaimers" },
      { href: "/about/brand", label: "Brand" },
    ],
  },
  {
    title: "Legal",
    items: [
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/gdpr", label: "GDPR" },
      { href: "/legal/ccpa", label: "CCPA" },
      { href: "/legal/lan-terms", label: "LAN terms" },
    ],
  },
];

/** The social accounts; an empty href shows as "link pending". */
export const SOCIALS: readonly SocialLink[] = [
  { name: "Twitch", href: "https://www.twitch.tv/evergreencup", icon: TwitchIcon },
  { name: "YouTube", href: "https://www.youtube.com/@EGCosu", icon: YouTubeIcon },
  { name: "Discord", href: DISCORD_INVITE_URL, icon: DiscordIcon },
  { name: "Ko-fi", href: KOFI_URL, icon: KofiIcon },
  { name: "Challonge", href: CHALLONGE_URL, icon: BracketIcon },
  { name: "osu! forum", href: "", icon: OsuIcon },
];

/**
 * @function withHref
 * @param links {readonly SocialLink[]} the social list
 * @param name {string} the account to change
 * @param href {string | null | undefined} its new link; nothing changes when empty
 * @returns {SocialLink[]} a copy with that account's href replaced (an admin-set invite or post)
 */
export const withHref = (
  links: readonly SocialLink[],
  name: string,
  href: string | null | undefined,
): SocialLink[] => links.map((l) => (l.name === name && href ? { ...l, href } : l));
