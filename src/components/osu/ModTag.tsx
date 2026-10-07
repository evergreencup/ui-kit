/**
 * @file src/components/osu/ModTag.tsx
 * @desc A mod slot label ("HD2") in its pick color on its tint. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { cx } from "../../utils/cx.js";
import { modColor } from "./modColors.js";
import { slotLabel } from "./osuLinks.js";

/** The mod, an optional slot number and extra classes. */
export type ModTagProps = {
  mod: string;
  index?: number | undefined;
  className?: string | undefined;
};

/**
 * @function ModTag
 * @param props {ModTagProps} mod, index and className
 * @returns {JSX.Element} the colored tag
 */
export const ModTag = ({ mod, index, className }: ModTagProps) => {
  const color = modColor(mod);
  return (
    <span
      className={cx(
        "shrink-0 rounded-sm px-1.5 py-1 font-bold font-mono text-[11px] uppercase tracking-[0.12em]",
        className,
      )}
      style={{ color: color.ink, backgroundColor: color.tint }}
    >
      {index === undefined ? mod : slotLabel(mod, index)}
    </span>
  );
};
