/**
 * @file src/components/atmosphere/Weather.tsx
 * @desc RainLayer and SnowLayer: ParticleLayer with the rain or snow engine and each one's
 *       default alpha (rain faint at 0.18, snow bright at 0.9). No directive: ParticleLayer is
 *       the client file.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { ParticleLayer, type ParticleLayerProps } from "./ParticleLayer.js";

/** ParticleLayer props without the weather. */
export type WeatherLayerProps = Omit<ParticleLayerProps, "weather">;

/**
 * @function RainLayer
 * @param props {WeatherLayerProps} intensity (default "light"), opacity (default 0.18), depth
 * @returns {JSX.Element | null} the rain canvas
 */
export const RainLayer = ({ opacity = 0.18, ...props }: WeatherLayerProps) => (
  <ParticleLayer weather="rain" opacity={opacity} {...props} />
);

/**
 * @function SnowLayer
 * @param props {WeatherLayerProps} intensity (default "light"), opacity (default 0.9), depth
 * @returns {JSX.Element | null} the snow canvas
 */
export const SnowLayer = ({ opacity = 0.9, ...props }: WeatherLayerProps) => (
  <ParticleLayer weather="snow" opacity={opacity} {...props} />
);
