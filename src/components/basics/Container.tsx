/**
 * @file src/components/basics/Container.tsx
 * @desc The page's centered column with the cup's gutters (px-4, sm:px-6, lg:px-8). Widths
 *       match the pages: prose 3xl, page 5xl (heroes, articles), wide 6xl, full 7xl (header, footer).
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { cx } from "../../utils/cx.js";

/** The column's max width. */
export type ContainerWidth = "prose" | "page" | "wide" | "full";

/** Native div props, plus the width and the element. */
export type ContainerProps = Omit<ComponentProps<"div">, "ref"> & {
  width?: ContainerWidth | undefined;
  as?: "div" | "section" | "main" | undefined;
};

/** Max width per container size. */
export const CONTAINER_WIDTHS: Record<ContainerWidth, string> = {
  prose: "max-w-3xl",
  page: "max-w-5xl",
  wide: "max-w-6xl",
  full: "max-w-7xl",
};

/** The gutters every container and full-width band shares. */
export const GUTTERS = "px-4 sm:px-6 lg:px-8";

/**
 * @function Container
 * @param props {ContainerProps} width (default "page"), element (default div) and native props
 * @returns {JSX.Element} a centered, full-width column with gutters
 */
export const Container = ({
  width = "page",
  as: Element = "div",
  className,
  ...props
}: ContainerProps) => (
  <Element
    className={cx("mx-auto w-full", CONTAINER_WIDTHS[width], GUTTERS, className)}
    {...props}
  />
);
