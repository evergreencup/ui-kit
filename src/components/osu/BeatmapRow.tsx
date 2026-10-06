/**
 * @file src/components/osu/BeatmapRow.tsx
 * @desc One mappool slot as a list row: the mod's color rail, its slot tag, artist and title
 *       linking to the map, difficulty and mapper, notes, star rating, the stat strip (lg up) and
 *       a copy-id button, over the set's cover fading out to the right. Server-safe (the copy
 *       button is a client island).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { formatMmSs } from "../../utils/format.js";
import { CopyButton } from "../basics/CopyButton.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { panelClasses } from "../basics/panelStyles.js";
import { Stat } from "../basics/Stat.js";
import { ModTag } from "./ModTag.js";
import { modColor } from "./modColors.js";
import { beatmapUrl, coverUrl, profileUrl } from "./osuLinks.js";

/** A pool slot in plain numbers and strings. */
export type BeatmapSlot = {
  mod: string;
  index: number;
  beatmapId: number;
  beatmapsetId: number;
  artist: string;
  title: string;
  difficulty: string;
  mapperName?: string | null | undefined;
  mapperOsuId?: number | null | undefined;
  starRating: number;
  bpm: number;
  lengthSeconds: number;
  cs: number;
  ar: number;
  od: number;
  hp: number;
  notes?: string | null | undefined;
};

const MASK = "linear-gradient(to right, black 0%, transparent 72%)";

/**
 * @function slotStats
 * @param slot {BeatmapSlot} the slot
 * @returns {[string, string][]} the stat strip's label and value pairs, in display order
 */
export const slotStats = (slot: BeatmapSlot): [string, string][] => [
  ["BPM", slot.bpm.toString()],
  ["LEN", formatMmSs(slot.lengthSeconds)],
  ["CS", slot.cs.toFixed(1)],
  ["AR", slot.ar.toFixed(1)],
  ["OD", slot.od.toFixed(1)],
  ["HP", slot.hp.toFixed(1)],
];

const Mapper = ({ slot }: { slot: BeatmapSlot }): ReactNode => {
  if (slot.mapperOsuId) {
    return (
      <>
        {" · "}
        <a
          href={profileUrl(slot.mapperOsuId)}
          target="_blank"
          rel="noreferrer"
          className={cx("rounded-sm transition hover:text-evergreen-200", FOCUS_RING)}
        >
          {slot.mapperName ?? "mapper"}
        </a>
      </>
    );
  }
  return slot.mapperName ? ` · ${slot.mapperName}` : null;
};

/**
 * @function BeatmapRow
 * @param props {{ slot: BeatmapSlot }} the slot
 * @returns {JSX.Element} the `<li>` row; render inside a `<ul>`
 */
export const BeatmapRow = ({ slot }: { slot: BeatmapSlot }) => (
  <li
    className={panelClasses({
      padding: "none",
      interactive: true,
      className: "group relative flex items-center overflow-hidden",
    })}
  >
    <span
      aria-hidden
      className="absolute inset-y-0 left-0 w-[3px]"
      style={{ backgroundColor: modColor(slot.mod).hex }}
    />
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-2/3 overflow-hidden"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      {/* biome-ignore lint/performance/noImgElement: osu! covers stay out of next/image's host list */}
      <img
        src={coverUrl(slot.beatmapsetId)}
        alt=""
        loading="lazy"
        className="size-full object-cover opacity-20 transition duration-500 ease-out group-hover:scale-[1.06] group-hover:opacity-40 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </span>
    <div className="relative flex min-w-0 flex-1 items-center gap-3 py-2.5 pr-3 pl-4">
      <ModTag mod={slot.mod} index={slot.index} />
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <a
          href={beatmapUrl(slot.beatmapId)}
          target="_blank"
          rel="noreferrer"
          className={cx(
            "truncate rounded-sm font-semibold text-evergreen-50 text-sm transition hover:text-evergreen-200",
            FOCUS_RING,
          )}
        >
          {slot.artist} - {slot.title}
        </a>
        <span className="truncate text-[11px] text-fog-400">
          [{slot.difficulty}]
          <Mapper slot={slot} />
        </span>
        {slot.notes ? (
          <span className="truncate text-[11px] text-fog-500 italic">{slot.notes}</span>
        ) : null}
      </div>
      <span className="shrink-0 font-mono font-semibold text-evergreen-200 text-xs tabular-nums">
        {slot.starRating.toFixed(2)}★
      </span>
      <div className="hidden shrink-0 items-baseline gap-3 lg:flex">
        {slotStats(slot).map(([label, value]) => (
          <Stat key={label} variant="inline" label={label} value={value} />
        ))}
      </div>
      <CopyButton
        value={slot.beatmapId.toString()}
        label="ID"
        aria-label={`Copy map id ${slot.beatmapId.toString()}`}
        className="shrink-0"
      />
    </div>
  </li>
);
