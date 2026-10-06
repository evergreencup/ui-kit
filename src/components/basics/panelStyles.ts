/**
 * @file src/components/basics/panelStyles.ts
 * @desc Class builder for the hairline-bordered panel every card, table frame and form section
 *       sits in, plus the hairline and divider constants used inside them.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";

/**
 * The panel's fill: `default` translucent Pitch, `solid` opaque Pitch, `raised` a lighter
 * evergreen-900 wash, `striped` the faint diagonal hatch for pending and placeholder notes,
 * `active` an evergreen-500 edge for a highlighted card (a captain, a cleared tier).
 */
export type PanelTone = "default" | "solid" | "raised" | "striped" | "active";

/** Inner padding: none, sm (p-3), md (p-4), lg (p-5), xl (p-6, p-8 from sm). */
export type PanelPadding = "none" | "sm" | "md" | "lg" | "xl";

/** Options for {@link panelClasses}. */
export type PanelClassOptions = {
  tone?: PanelTone | undefined;
  padding?: PanelPadding | undefined;
  /** Lift the border on hover (rows and cards that link somewhere). */
  interactive?: boolean | undefined;
  className?: string | undefined;
};

/** The hairline border color panels and dividers share. */
export const HAIRLINE = "border-evergreen-800/60";

/** A top divider inside a panel, separating its footer section. */
export const DIVIDER = "border-t border-evergreen-800/40 pt-3";

const TONES: Record<PanelTone, string> = {
  default: `${HAIRLINE} bg-evergreen-950/40`,
  solid: `${HAIRLINE} bg-evergreen-950`,
  raised: "border-evergreen-800/70 bg-evergreen-900/40",
  striped: "diag-stripes border-evergreen-800/50 bg-evergreen-950/40",
  active: "border-evergreen-500/60 bg-evergreen-950/40",
};

const PADDING: Record<PanelPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
  xl: "p-6 sm:p-8",
};

/**
 * @function panelClasses
 * @param opts {PanelClassOptions} tone (default "default"), padding (default "lg"), interactive
 *        and extra classes
 * @returns {string} the panel classes with the caller's className last
 */
export const panelClasses = ({
  tone = "default",
  padding = "lg",
  interactive = false,
  className,
}: PanelClassOptions = {}): string =>
  cx(
    "rounded-sm border",
    TONES[tone],
    PADDING[padding],
    interactive && "transition-colors hover:border-evergreen-600/60",
    className,
  );
