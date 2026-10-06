/**
 * @file src/components/layout/SiteHeader.tsx
 * @desc The sticky, blurred site header: the rolling EGC lockup home link, the desktop nav
 *       (md up), an actions slot (a Discord icon, the account pill), the call to action, and the
 *       mobile menu. All data comes in as props. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { BRAND } from "../../brand/identity.js";
import { cx } from "../../utils/cx.js";
import { AutoLink } from "../basics/AutoLink.js";
import { buttonClasses } from "../basics/buttonStyles.js";
import { Container } from "../basics/Container.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { HeaderWordmark } from "../brand/HeaderWordmark.js";
import { MobileMenu } from "./MobileMenu.js";
import { NavLink } from "./NavLink.js";
import type { NavItem } from "./nav.js";

/** The nav, call to action, account link and slots. */
export type SiteHeaderProps = {
  items: readonly NavItem[];
  cta?: NavItem | undefined;
  /** The account entry for the mobile menu ("Sign in" or "Dashboard"). */
  account?: NavItem | undefined;
  /** Desktop extras between the nav and the call to action. */
  actions?: ReactNode;
  /** Extras at the bottom of the mobile menu. */
  mobileExtras?: ReactNode;
  className?: string | undefined;
};

/**
 * @function SiteHeader
 * @param props {SiteHeaderProps} items, cta, account, actions, mobileExtras and className
 * @returns {JSX.Element} the header banner
 */
export const SiteHeader = ({
  items,
  cta,
  account,
  actions,
  mobileExtras,
  className,
}: SiteHeaderProps) => (
  <header
    className={cx(
      "sticky top-0 z-30 bg-evergreen-950/70 backdrop-blur-md before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-evergreen-800/70 before:via-evergreen-800/40 before:to-transparent",
      className,
    )}
  >
    <Container width="full" className="flex h-16 items-center justify-between gap-4">
      <AutoLink
        href="/"
        aria-label={`${BRAND.name}, home`}
        className={cx("group flex items-center rounded-sm", FOCUS_RING)}
      >
        <HeaderWordmark />
      </AutoLink>
      <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
        {items.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            className="px-1 py-3 font-medium text-[13px] uppercase tracking-[0.14em] transition-colors"
            inactiveClassName="text-fog-400 hover:text-evergreen-100"
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        {actions ? <div className="hidden items-center gap-2 md:flex">{actions}</div> : null}
        {cta ? (
          <AutoLink
            href={cta.href}
            className={buttonClasses({ size: "md", className: "hidden md:inline-flex" })}
          >
            {cta.label}
          </AutoLink>
        ) : null}
        <MobileMenu items={items} cta={cta} account={account}>
          {mobileExtras}
        </MobileMenu>
      </div>
    </Container>
  </header>
);
