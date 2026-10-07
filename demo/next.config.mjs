/**
 * @file demo/next.config.mjs
 * @desc The demo is a static export, so GitHub Pages can host it. DEMO_BASE_PATH sets the path
 *       it lives under ("/ui-kit" on Pages, empty for the consumer check).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** @type {import("next").NextConfig} */
export default {
  output: "export",
  basePath: process.env.DEMO_BASE_PATH ?? "",
  images: { unoptimized: true },
};
