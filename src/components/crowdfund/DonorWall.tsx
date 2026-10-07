/**
 * @file src/components/crowdfund/DonorWall.tsx
 * @desc Client donor wall: a heading, "Latest" and "Top donors" tabs (arrows, Home and End move
 *       between them) and the chosen list of DonorCards, ranked on the top list. Both lists come
 *       in as props, so switching never refetches.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import { type KeyboardEvent, useId, useRef, useState } from "react";
import { rovingKey } from "../../utils/roving.js";
import { buttonClasses } from "../basics/buttonStyles.js";
import { DisplayHeading, type HeadingLevel } from "../basics/DisplayHeading.js";
import { HAIRLINE } from "../basics/panelStyles.js";
import { DonorCard } from "./DonorCard.js";
import type { Donor } from "./donors.js";

/** The two lists, the heading and the empty line. */
export type DonorWallProps = {
  latest: readonly Donor[];
  top: readonly Donor[];
  title?: string | undefined;
  /** When the chosen list is empty (default "No contributions logged yet. Yours could be the first."). */
  empty?: string | undefined;
  level?: HeadingLevel | undefined;
};

const TABS = [
  { id: "latest", label: "Latest" },
  { id: "top", label: "Top donors" },
] as const;

/**
 * @function DonorWall
 * @param props {DonorWallProps} latest, top, title (default "Donor wall"), empty and level
 *        (default 2)
 * @returns {JSX.Element} the wall section
 */
export const DonorWall = ({
  latest,
  top,
  title = "Donor wall",
  empty = "No contributions logged yet. Yours could be the first.",
  level = 2,
}: DonorWallProps) => {
  const id = useId();
  const [tab, setTab] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const ranked = tab === 1;
  const rows = ranked ? top : latest;
  const current = ranked ? TABS[1] : TABS[0];
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next = rovingKey(event.key, tab, TABS.length);
    if (next === null) return;
    event.preventDefault();
    setTab(next);
    refs.current[next]?.focus();
  };
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <DisplayHeading level={level} size="xl" className="font-black uppercase">
          {title}
        </DisplayHeading>
        <div
          role="tablist"
          aria-label={`${title} sort`}
          className={`flex overflow-hidden rounded-sm border ${HAIRLINE}`}
        >
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-${t.id}`}
              aria-selected={tab === i}
              aria-controls={`${id}-panel`}
              tabIndex={tab === i ? 0 : -1}
              onClick={() => {
                setTab(i);
              }}
              onKeyDown={onKeyDown}
              className={buttonClasses({
                variant: tab === i ? "primary" : "ghost",
                className: "rounded-none text-[11px] shadow-none not-disabled:hover:translate-y-0",
              })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${current.id}`}>
        {rows.length === 0 ? (
          <p className="text-fog-500 italic">{empty}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((donor, index) => (
              <DonorCard
                key={`${current.id}-${donor.id}`}
                donor={donor}
                rank={ranked ? index + 1 : undefined}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
