/**
 * @file src/components/basics/Stat.tsx
 * @desc One labeled number: stacked (caption over value, roster cards), inline ("BPM 180",
 *       stat strips) or headline (big display figure, chart cards and the funding total).
 *       Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { labelClasses } from "./labelStyles.js";

/** How the label and value sit. */
export type StatVariant = "stacked" | "inline" | "headline";

/** The stat's label, value, layout and extra classes. */
export type StatProps = {
  label: ReactNode;
  value: ReactNode;
  variant?: StatVariant | undefined;
  className?: string | undefined;
};

/**
 * @function Stat
 * @param props {StatProps} label, value, variant (default "stacked") and className
 * @returns {JSX.Element} the stat
 */
export const Stat = ({ label, value, variant = "stacked", className }: StatProps) => {
  if (variant === "inline") {
    return (
      <span
        className={labelClasses({
          tone: "muted",
          className: cx("font-normal tracking-[0.16em]", className),
        })}
      >
        <span className="text-fog-500">{label}</span> {value}
      </span>
    );
  }
  const headline = variant === "headline";
  return (
    <div className={cx("flex flex-col", headline ? "items-end gap-0.5" : "", className)}>
      {headline ? null : <span className={labelClasses({ tone: "fog", size: "xs" })}>{label}</span>}
      <span
        className={
          headline
            ? "font-black font-display text-2xl text-evergreen-100 leading-none tracking-[-0.02em]"
            : "font-mono font-semibold text-evergreen-100 text-xs"
        }
      >
        {value}
      </span>
      {headline ? <span className={labelClasses({ tone: "fog", size: "xs" })}>{label}</span> : null}
    </div>
  );
};
