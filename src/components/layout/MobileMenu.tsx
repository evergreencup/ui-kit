/**
 * @file src/components/layout/MobileMenu.tsx
 * @desc Client mobile nav drawer: a menu button (md and down) that slides a full-screen panel in
 *       from the right with the nav, the call to action, the account link and extra actions.
 *       The panel portals to <body> (a blurred header would clamp a fixed child to itself), closes
 *       on Escape, the backdrop, the close button and a route change, and locks page scroll.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

"use client";

import { usePathname } from "next/navigation.js";
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey, useFocusTrap, useScrollLock } from "../../hooks/useDismiss.js";
import { useMounted } from "../../hooks/useMounted.js";
import { cx } from "../../utils/cx.js";
import { buttonClasses } from "../basics/buttonStyles.js";
import { CloseIcon, MenuIcon } from "../icons/icons.js";
import { NavLink } from "./NavLink.js";
import type { NavItem } from "./nav.js";

/** The entries, the call to action and the account link, plus extra content under them. */
export type MobileMenuProps = {
  items: readonly NavItem[];
  cta?: NavItem | undefined;
  account?: NavItem | undefined;
  /** More links or buttons at the bottom (a Discord join link). */
  children?: ReactNode;
};

const ROUND =
  "rounded-full border border-evergreen-800 bg-evergreen-900/70 p-2 text-evergreen-100 hover:border-evergreen-600 hover:text-evergreen-50";

/**
 * @function MobileMenu
 * @param props {MobileMenuProps} items, cta, account and children
 * @returns {JSX.Element} the toggle button and, once mounted, the portaled drawer
 */
export const MobileMenu = ({ items, cta, account, children }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const pathname = usePathname();
  const id = useId();
  const dialog = useRef<HTMLDivElement | null>(null);
  const close = useCallback(() => {
    setOpen(false);
  }, []);
  useEscapeKey(open, close);
  useScrollLock(open);
  useFocusTrap(dialog, open);
  // biome-ignore lint/correctness/useExhaustiveDependencies: the route is the signal to close on
  useEffect(close, [pathname]);

  const drawer = (
    <>
      <div
        aria-hidden
        onClick={close}
        className={cx(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        ref={dialog}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={cx(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto bg-evergreen-950 px-6 pt-5 pb-8 transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className={buttonClasses({ variant: "ghost", pill: true, className: ROUND })}
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-4 flex flex-col gap-2">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              underline={false}
              className="rounded-xl px-4 py-3 font-medium text-lg transition-colors"
              activeClassName="bg-evergreen-800/60 text-evergreen-50"
              inactiveClassName="text-evergreen-100 hover:bg-evergreen-900 hover:text-evergreen-50"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-3 border-evergreen-800 border-t pt-6">
          {[cta, account].map((link, i) =>
            link ? (
              <NavLink
                key={link.href}
                href={link.href}
                underline={false}
                className={buttonClasses({
                  variant: i === 0 ? "primary" : "outline",
                  size: "lg",
                  pill: true,
                })}
                activeClassName=""
                inactiveClassName=""
              >
                {link.label}
              </NavLink>
            ) : null,
          )}
          {children}
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen(true);
        }}
        className={buttonClasses({
          variant: "ghost",
          pill: true,
          className: cx(ROUND, "md:hidden"),
        })}
      >
        <MenuIcon />
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
};
