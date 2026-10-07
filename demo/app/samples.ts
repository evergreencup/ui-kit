/**
 * @file demo/app/samples.ts
 * @desc Sample data the server page and the client demos share. A plain module, so the server
 *       page gets the data itself rather than a client reference.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { CLASSIC_BANNER_STYLE, type DonorBannerVariant } from "@evergreencup/ui-kit";

// The art is hotlinked from haruhime.moe; the kit and this demo ship none.
const ART = "https://www.haruhime.moe/egc/skyline-poster.webp";

export const BANNER_VARIANTS: DonorBannerVariant[] = [
  { id: "frost", label: "Classic", src: ART, ...CLASSIC_BANNER_STYLE },
  {
    id: "dusk",
    label: "Low",
    src: ART,
    ...CLASSIC_BANNER_STYLE,
    offsetY: 40,
    name: { ...CLASSIC_BANNER_STYLE.name, size: 44 },
  },
];
