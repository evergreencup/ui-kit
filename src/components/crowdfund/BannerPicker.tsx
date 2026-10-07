/**
 * @file src/components/crowdfund/BannerPicker.tsx
 * @desc A grid of donation-banner looks, each a live DonorBanner preview with the donor's name,
 *       pressing one picks it. Controlled; server-safe (the handler comes from the caller).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { labelClasses } from "../basics/labelStyles.js";
import { panelClasses } from "../basics/panelStyles.js";
import { PickerGroup } from "../forms/PickerGroup.js";
import type { DonorBannerVariant } from "./bannerVariants.js";
import { DonorBanner } from "./DonorBanner.js";

/** The looks, the donor's name and subtitle, and the controlled choice. */
export type BannerPickerProps = {
  variants: readonly DonorBannerVariant[];
  name: string;
  subtitle?: string | null | undefined;
  value: string;
  onChange: (id: string) => void;
  /** The group's name (default "Banner style"). */
  label?: string | undefined;
  disabled?: boolean | undefined;
};

/**
 * @function BannerPicker
 * @param props {BannerPickerProps} variants, name, subtitle, value, onChange, label and disabled
 * @returns {JSX.Element} a fieldset of pressable previews
 */
export const BannerPicker = ({
  variants,
  name,
  subtitle,
  value,
  onChange,
  label = "Banner style",
  disabled = false,
}: BannerPickerProps) => (
  <PickerGroup label={label} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {variants.map((v) => {
      const active = v.id === value;
      return (
        <button
          type="button"
          key={v.id}
          disabled={disabled}
          aria-pressed={active}
          onClick={() => {
            onChange(v.id);
          }}
          className={panelClasses({
            tone: active ? "active" : "default",
            padding: "sm",
            interactive: !active,
            className: cx(
              "flex flex-col gap-2 p-2 text-left disabled:cursor-not-allowed disabled:opacity-60",
              active && "ring-2 ring-evergreen-400/60",
              FOCUS_RING,
            ),
          })}
        >
          <DonorBanner name={name} subtitle={subtitle} variant={v} />
          <span className={labelClasses({ tone: "muted", size: "md" })}>
            {v.label}
            {active ? " · selected" : ""}
          </span>
        </button>
      );
    })}
  </PickerGroup>
);
