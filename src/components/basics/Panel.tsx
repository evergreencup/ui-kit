/**
 * @file src/components/basics/Panel.tsx
 * @desc The bordered panel as an element: a div by default, or the section, article, aside,
 *       li or figure the content calls for. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { type PanelClassOptions, panelClasses } from "./panelStyles.js";

/** The elements a panel can render as. */
export type PanelElement = "div" | "section" | "article" | "aside" | "li" | "figure";

/** Native props of the chosen element (no ref: the element varies), plus the panel's tone, padding and interactive flag. */
export type PanelProps = Omit<ComponentProps<"div">, "ref"> &
  Omit<PanelClassOptions, "className"> & { as?: PanelElement | undefined };

/**
 * @function Panel
 * @param props {PanelProps} element (default div), tone, padding, interactive and native props
 * @returns {JSX.Element} the element styled as a hairline panel
 */
export const Panel = ({
  as: Element = "div",
  tone,
  padding,
  interactive,
  className,
  ...props
}: PanelProps) => {
  // One prop shape for every element: the elements share their attributes, minus ref.
  const Tag = Element as "div";
  return <Tag className={panelClasses({ tone, padding, interactive, className })} {...props} />;
};
