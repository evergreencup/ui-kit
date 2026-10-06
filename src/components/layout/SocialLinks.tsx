/**
 * @file src/components/layout/SocialLinks.tsx
 * @desc A row of round social icon links. An entry with an empty href renders dimmed as "link
 *       pending" instead of vanishing, so the row keeps its shape. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentType } from "react";
import { cx } from "../../utils/cx.js";
import { AutoLink } from "../basics/AutoLink.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import type { IconProps } from "../icons/Icon.js";

/** One social account: its name, link (empty while pending) and icon. */
export type SocialLink = { name: string; href: string; icon: ComponentType<IconProps> };

/** The accounts and class overrides. */
export type SocialLinksProps = {
  links: readonly SocialLink[];
  className?: string | undefined;
  itemClassName?: string | undefined;
};

const ITEM = `inline-flex size-10 items-center justify-center rounded-full border border-evergreen-800 bg-evergreen-900/50 text-fog-300 transition coarse:size-11 ${FOCUS_RING}`;

/**
 * @function SocialLinks
 * @param props {SocialLinksProps} links, className and itemClassName
 * @returns {JSX.Element} the list of icon links
 */
export const SocialLinks = ({ links, className, itemClassName }: SocialLinksProps) => (
  <ul className={cx("flex flex-wrap items-center gap-3", className)}>
    {links.map(({ name, href, icon: Icon }) => (
      <li key={name}>
        {href ? (
          <AutoLink
            href={href}
            aria-label={name}
            className={cx(
              ITEM,
              "hover:border-evergreen-500 hover:text-evergreen-50",
              itemClassName,
            )}
          >
            <Icon />
          </AutoLink>
        ) : (
          <span
            role="img"
            aria-label={`${name} (link pending)`}
            title={`${name}: link pending`}
            className={cx(ITEM, "cursor-not-allowed opacity-40", itemClassName)}
          >
            <Icon />
          </span>
        )}
      </li>
    ))}
  </ul>
);
