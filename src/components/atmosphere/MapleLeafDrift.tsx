/**
 * @file src/components/atmosphere/MapleLeafDrift.tsx
 * @desc A lone bark maple leaf drifting diagonally across a hero. Client: hidden under reduced
 *       motion and on the server.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import type { CSSProperties } from "react";
import { useMotionEnabled } from "../../hooks/useMediaQuery.js";
import { cx } from "../../utils/cx.js";
import { MapleLeafGlyph } from "../brand/MapleLeafGlyph.js";

/** Where the leaf starts (positioning classes) and its delay. */
export type MapleLeafDriftProps = { className?: string | undefined; delay?: string | undefined };

/**
 * @function MapleLeafDrift
 * @param props {MapleLeafDriftProps} className (default top right) and delay (default 1.5s)
 * @returns {JSX.Element | null} the drifting leaf, or nothing when motion is off
 */
export const MapleLeafDrift = ({ className, delay = "1.5s" }: MapleLeafDriftProps) => {
  const enabled = useMotionEnabled();
  if (!enabled) return null;
  return (
    <div aria-hidden className={cx("pointer-events-none absolute top-[12%] right-[8%]", className)}>
      <MapleLeafGlyph
        className="leaf-drift size-10 text-bark-400 md:size-14"
        style={{ "--leaf-delay": delay } as CSSProperties}
      />
    </div>
  );
};
