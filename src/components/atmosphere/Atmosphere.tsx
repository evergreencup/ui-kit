/**
 * @file src/components/atmosphere/Atmosphere.tsx
 * @desc The layered PNW backdrop for a section: sky, Rainier, the skyline, mist, two tree rows,
 *       a ground rim, then weather and the drifting leaf, stacked by depth. Fills its positioned
 *       parent. Server-safe; the weather and parallax pieces are client islands.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { MapleLeafDrift } from "./MapleLeafDrift.js";
import { MistBand } from "./MistBand.js";
import { MountRainier } from "./MountRainier.js";
import { ParallaxScope } from "./ParallaxScope.js";
import { type SceneConfig, type ScenePreset, scene } from "./presets.js";
import { SeattleSkyline } from "./SeattleSkyline.js";
import { Sky } from "./Sky.js";
import { TreeLine } from "./TreeLine.js";
import { RainLayer, SnowLayer } from "./Weather.js";

/** The scene, whether layers follow the pointer, and wrapper classes. */
export type AtmosphereProps = {
  /** A preset name or overrides of the default scene (default "home"). */
  variant?: ScenePreset | Partial<SceneConfig> | undefined;
  parallax?: boolean | undefined;
  className?: string | undefined;
};

const Layers = ({ cfg }: { cfg: SceneConfig }) => (
  <>
    <Sky tintTop={cfg.skyTintTop} tintMid={cfg.skyTintMid} stars={cfg.stars} />
    {cfg.rainier.show ? (
      <MountRainier offsetX={cfg.rainier.offsetX} scale={cfg.rainier.scale} />
    ) : null}
    {cfg.skyline.show ? (
      <SeattleSkyline offsetX={cfg.skyline.offsetX} opacity={cfg.skyline.opacity} />
    ) : null}
    {cfg.mistA ? <MistBand top="32%" height="12%" opacity={0.18} depth={7} /> : null}
    <TreeLine layer="far" density={cfg.farDensity} />
    {cfg.mistB ? (
      <MistBand top="48%" height="10%" opacity={0.22} tint="var(--color-fog-500)" depth={14} />
    ) : null}
    <TreeLine layer="near" density={cfg.nearDensity} />
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-5 bg-evergreen-950 shadow-[inset_0_-1px_0_var(--color-evergreen-900)]"
    />
    {cfg.rain === "none" ? null : <RainLayer intensity={cfg.rain} depth={6} />}
    {cfg.snow === "none" ? null : <SnowLayer intensity={cfg.snow} depth={8} />}
    {cfg.leaf ? <MapleLeafDrift /> : null}
  </>
);

/**
 * @function Atmosphere
 * @param props {AtmosphereProps} variant, parallax (default false) and className
 * @returns {JSX.Element} the backdrop, absolutely filling its parent, aria-hidden
 */
export const Atmosphere = ({ variant = "home", parallax = false, className }: AtmosphereProps) => {
  const classes = cx("pointer-events-none absolute inset-0 overflow-hidden", className);
  const layers = <Layers cfg={scene(variant)} />;
  return parallax ? (
    <ParallaxScope className={classes}>{layers}</ParallaxScope>
  ) : (
    <div aria-hidden className={classes}>
      {layers}
    </div>
  );
};
