/**
 * @file src/components/icons/Icon.tsx
 * @desc The one SVG icon component and the factory every named icon is built with. Icons are
 *       decorative (aria-hidden) unless given a `title`, which makes them role="img" with that
 *       name. Size comes from className (default size-5). Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { cx } from "../../utils/cx.js";

/** How an icon's paths paint: filled glyphs (brand marks) or 2px round strokes (UI glyphs). */
export type IconPaint = "fill" | "stroke";

/** The drawing: a viewBox, one or more path `d` strings, and how they paint. */
export type IconShape = { viewBox: string; paths: readonly string[]; paint: IconPaint };

/** Native svg props, plus an optional accessible title. */
export type IconProps = Omit<ComponentProps<"svg">, "children"> & {
  /** Names the icon for screen readers; without it the icon is hidden from them. */
  title?: string | undefined;
};

const PAINT: Record<IconPaint, ComponentProps<"svg">> = {
  fill: { fill: "currentColor" },
  stroke: {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
};

/**
 * @function Icon
 * @param props {IconProps & { shape: IconShape }} the drawing, title, className and svg props
 * @returns {JSX.Element} the svg
 */
export const Icon = ({ shape, title, className, ...props }: IconProps & { shape: IconShape }) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: titled icons get a <title>; the rest are aria-hidden
  <svg
    viewBox={shape.viewBox}
    className={cx("size-5 shrink-0", className)}
    {...PAINT[shape.paint]}
    {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    {shape.paths.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

/**
 * @function createIcon
 * @param shape {IconShape} the drawing
 * @param displayName {string} the component's name in devtools
 * @returns {(props: IconProps) => JSX.Element} a named icon component
 */
export const createIcon = (shape: IconShape, displayName: string) => {
  const Named = (props: IconProps) => <Icon shape={shape} {...props} />;
  Named.displayName = displayName;
  return Named;
};
