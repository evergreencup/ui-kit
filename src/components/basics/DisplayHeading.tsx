/**
 * @file src/components/basics/DisplayHeading.tsx
 * @desc A display heading at a required level and a chosen size, so the outline and the look
 *       stay independent. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ComponentProps } from "react";
import { type HeadingSize, headingClasses } from "./headingStyles.js";

/** A heading level, 1 to 4. */
export type HeadingLevel = 1 | 2 | 3 | 4;

/** Native heading props, plus the level and the display size. */
export type DisplayHeadingProps = ComponentProps<"h2"> & {
  level: HeadingLevel;
  size?: HeadingSize | undefined;
};

/**
 * @function DisplayHeading
 * @param props {DisplayHeadingProps} level (h1 to h4), size (default "lg") and native props
 * @returns {JSX.Element} the heading element in the display face
 */
export const DisplayHeading = ({ level, size, className, ...props }: DisplayHeadingProps) => {
  const Tag = `h${level.toString()}` as "h2";
  return <Tag className={headingClasses(size, className)} {...props} />;
};
