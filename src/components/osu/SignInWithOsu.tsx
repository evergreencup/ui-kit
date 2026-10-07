/**
 * @file src/components/osu/SignInWithOsu.tsx
 * @desc The "Sign in with osu!" button in osu! pink with the osu! mark: a ButtonLink when given
 *       an href (the app's sign-in route), a Button when given an onClick. No auth library here.
 *       Server-safe (a handler comes from a client caller).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "../basics/Button.js";
import { ButtonLink, type ButtonLinkProps } from "../basics/ButtonLink.js";
import { OsuIcon } from "../icons/icons.js";

type Shared = { children?: ReactNode; size?: ButtonProps["size"]; pill?: boolean | undefined };

/** Either a link (href) or a button (onClick, pending), with the label, size and pill shape. */
export type SignInWithOsuProps =
  | (Shared & Omit<ButtonLinkProps, "variant" | "children" | "size" | "pill">)
  | (Shared & Omit<ButtonProps, "variant" | "children" | "size" | "pill"> & { href?: undefined });

/**
 * @function SignInWithOsu
 * @param props {SignInWithOsuProps} href or button props, children (default "Sign in with osu!"),
 *        size (default "lg") and pill (default true)
 * @returns {JSX.Element} the link or button
 */
export const SignInWithOsu = ({
  children = "Sign in with osu!",
  size = "lg",
  pill = true,
  ...props
}: SignInWithOsuProps) => {
  const body = (
    <>
      <OsuIcon className="size-4" />
      {children}
    </>
  );
  return props.href === undefined ? (
    <Button variant="osu" size={size} pill={pill} pendingLabel="Redirecting…" {...props}>
      {body}
    </Button>
  ) : (
    <ButtonLink variant="osu" size={size} pill={pill} {...props}>
      {body}
    </ButtonLink>
  );
};
