/**
 * @file src/components/brand/SwatchTile.tsx
 * @desc One brand color as a figure: the color block with its step (or name) and hex in the
 *       ink that reads on it, captioned with the token and an optional usage line. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { inkFor } from "../../brand/colorMath.js";
import { cx } from "../../utils/cx.js";
import { panelClasses } from "../basics/panelStyles.js";

/** The color, what to print on and under it, and the block's height. */
export type SwatchTileProps = {
  hex: string;
  token: string;
  /** The big label on the block: a step ("400") or a name ("Mist"). */
  label: string;
  usage?: string | undefined;
  /** md h-24 (palette grids), lg h-40 (core colors). */
  size?: "md" | "lg" | undefined;
};

/**
 * @function SwatchTile
 * @param props {SwatchTileProps} hex, token, label, usage and size (default "md")
 * @returns {JSX.Element} the swatch figure
 */
export const SwatchTile = ({ hex, token, label, usage, size = "md" }: SwatchTileProps) => {
  const large = size === "lg";
  return (
    <figure
      className={panelClasses({ padding: "none", className: "flex flex-col overflow-hidden" })}
    >
      <div
        className={cx(
          "flex p-3",
          large ? "h-40 flex-col justify-between p-4" : "h-24 items-end justify-between",
        )}
        style={{ backgroundColor: hex, color: inkFor(hex) }}
      >
        <span
          className={large ? "font-black font-display text-2xl" : "font-mono font-semibold text-xs"}
        >
          {label}
        </span>
        <span className="font-mono text-xs uppercase tracking-wide">{hex}</span>
      </div>
      <figcaption className="flex flex-col gap-1 px-3 py-2 text-fog-300 text-xs">
        <span className="font-mono text-evergreen-50">{token}</span>
        {usage ? <span>{usage}</span> : null}
      </figcaption>
    </figure>
  );
};
