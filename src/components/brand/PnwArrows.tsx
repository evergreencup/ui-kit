/**
 * @file src/components/brand/PnwArrows.tsx
 * @desc The PNW arrow motifs that sit behind the wordmark: nested chevrons pointing inward,
 *       or a four-blade compass rose. Decorative, currentColor. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** chevrons (wide, 240x64) or compass (square, 200x200). */
export type PnwArrowsVariant = "chevrons" | "compass";

/** The variant and the svg's classes (size and color). */
export type PnwArrowsProps = {
  variant?: PnwArrowsVariant | undefined;
  className?: string | undefined;
};

const CHEVRONS = [
  { d: "M48 12 L20 32 L48 52", opacity: 1 },
  { d: "M76 12 L48 32 L76 52", opacity: 0.55 },
  { d: "M192 12 L220 32 L192 52", opacity: 1 },
  { d: "M164 12 L192 32 L164 52", opacity: 0.55 },
] as const;

const COMPASS = [
  { d: "M100 8 L120 92 L100 78 L80 92 Z", opacity: 1 },
  { d: "M192 100 L108 120 L122 100 L108 80 Z", opacity: 1 },
  { d: "M100 192 L80 108 L100 122 L120 108 Z", opacity: 1 },
  { d: "M8 100 L92 80 L78 100 L92 120 Z", opacity: 1 },
  { d: "M100 90 L110 100 L100 110 L90 100 Z", opacity: 0.7 },
] as const;

/**
 * @function PnwArrows
 * @param props {PnwArrowsProps} variant (default "chevrons") and className
 * @returns {JSX.Element} the motif, aria-hidden
 */
export const PnwArrows = ({ variant = "chevrons", className }: PnwArrowsProps) => {
  const chevrons = variant === "chevrons";
  const paths = chevrons ? CHEVRONS : COMPASS;
  return (
    <svg
      viewBox={chevrons ? "0 0 240 64" : "0 0 200 200"}
      aria-hidden
      className={className}
      {...(chevrons
        ? { fill: "none", stroke: "currentColor", strokeWidth: 6, strokeLinecap: "square" as const }
        : { fill: "currentColor" })}
    >
      {paths.map((p) => (
        <path key={p.d} d={p.d} opacity={p.opacity} />
      ))}
    </svg>
  );
};
