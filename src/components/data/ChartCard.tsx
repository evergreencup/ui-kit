/**
 * @file src/components/data/ChartCard.tsx
 * @desc The frame every chart sits in: an eyebrow and title on the left, an optional headline
 *       figure on the right, a caption, then the chart at a fixed height. An `empty` message
 *       replaces the chart when there is no data. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { DisplayHeading, type HeadingLevel } from "../basics/DisplayHeading.js";
import { Eyebrow } from "../basics/Eyebrow.js";
import { panelClasses } from "../basics/panelStyles.js";
import { Stat } from "../basics/Stat.js";

/** The labels, headline, chart, height and empty state. */
export type ChartCardProps = {
  eyebrow: string;
  title: string;
  caption?: string | undefined;
  headline?: string | undefined;
  headlineLabel?: string | undefined;
  children: ReactNode;
  /** tall h-72, wide h-60, square h-64. */
  aspect?: "tall" | "wide" | "square" | undefined;
  /** Show this instead of the chart. */
  empty?: string | undefined;
  level?: HeadingLevel | undefined;
};

const ASPECT = { tall: "h-72", wide: "h-60", square: "h-64" } as const;

/**
 * @function ChartCard
 * @param props {ChartCardProps} eyebrow, title, caption, headline, headlineLabel, children,
 *        aspect (default "wide"), empty and level (default 3)
 * @returns {JSX.Element} the chart panel
 */
export const ChartCard = ({
  eyebrow,
  title,
  caption,
  headline,
  headlineLabel = "",
  children,
  aspect = "wide",
  empty,
  level = 3,
}: ChartCardProps) => (
  <section className={panelClasses({ className: "flex flex-col gap-5" })}>
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <Eyebrow>{eyebrow}</Eyebrow>
        <DisplayHeading level={level} size="sm">
          {title}
        </DisplayHeading>
        {caption ? <p className="text-[11px] text-fog-500">{caption}</p> : null}
      </div>
      {headline ? <Stat variant="headline" label={headlineLabel} value={headline} /> : null}
    </header>
    <div className={`${ASPECT[aspect]} w-full`}>
      {empty ? (
        <p className="flex h-full items-center justify-center text-fog-500 text-sm italic">
          {empty}
        </p>
      ) : (
        children
      )}
    </div>
  </section>
);
