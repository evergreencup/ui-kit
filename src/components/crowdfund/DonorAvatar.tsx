/**
 * @file src/components/crowdfund/DonorAvatar.tsx
 * @desc A donor's square avatar, or a blank tile when they have none. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";

/**
 * @function DonorAvatar
 * @param props {{ src?: string | null; size: "md" | "lg" }} the avatar URL and size (44px, 56px)
 * @returns {JSX.Element} the decorative avatar or placeholder
 */
export const DonorAvatar = ({
  src,
  size,
}: {
  src?: string | null | undefined;
  size: "md" | "lg";
}) => {
  const box = cx("shrink-0 rounded-sm", size === "lg" ? "size-14" : "size-11");
  return src ? (
    // biome-ignore lint/performance/noImgElement: donor avatars stay out of next/image's host list
    <img
      src={src}
      alt=""
      loading="lazy"
      className={cx(box, "border border-evergreen-700 bg-evergreen-900 object-cover")}
    />
  ) : (
    <span aria-hidden className={cx(box, "bg-evergreen-800/60")} />
  );
};
