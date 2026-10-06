/**
 * @file src/components/data/Timeline.tsx
 * @desc A vertical timeline: each entry has a date column (sm up), a node on the rail showing
 *       its status (done, now, next, later, or a starred finale), and a card with tags, a display
 *       title, a blurb, meta and an optional expandable details block (native <details>, so it
 *       stays server-safe and keyboard-ready). Past entries dim until hovered. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { ReactNode } from "react";
import { cx } from "../../utils/cx.js";
import { FOCUS_RING } from "../basics/focusStyles.js";
import { CheckIcon, ChevronDownIcon, StarIcon } from "../icons/icons.js";

/** Where an entry sits relative to today. */
export type TimelineStatus = "past" | "active" | "next" | "future";

/** One entry. */
export type TimelineEntry = {
  id: string;
  title: ReactNode;
  status: TimelineStatus;
  /** The date column: a big primary line ("Oct 24"), an optional second, a small weekday. */
  date: { primary: string; secondary?: string | undefined; weekday?: string | undefined };
  /** The bark, striped finale treatment. */
  finale?: boolean | undefined;
  /** Chips at the top of the card (Badge, StatusBadge). */
  tags?: ReactNode;
  blurb?: ReactNode;
  /** A line under the blurb (best-of, links). */
  meta?: ReactNode;
  /** Expandable content and the summary text that opens it ("3 matches"). */
  details?: { summary: string; content: ReactNode; open?: boolean | undefined } | undefined;
};

const NODE = "relative z-10 grid size-5 place-items-center rounded-full border-2";
const NODES: Record<TimelineStatus, string> = {
  past: "border-evergreen-300 bg-evergreen-500 text-evergreen-950",
  active: "border-evergreen-100 bg-evergreen-400",
  next: "border-cascade-300 bg-cascade-900",
  future: "border-evergreen-700 bg-evergreen-950",
};
const RAIL: Record<TimelineStatus, string> = {
  past: "bg-evergreen-500/70",
  active: "bg-evergreen-500/50",
  next: "bg-evergreen-700/40",
  future: "bg-evergreen-700/40",
};
const STATUS_TEXT: Record<TimelineStatus, string> = {
  past: "Done",
  active: "Happening now",
  next: "Up next",
  future: "Later",
};

const cardClasses = (entry: TimelineEntry): string =>
  cx(
    "group relative overflow-hidden rounded-md border p-5 transition sm:p-6",
    entry.finale
      ? "border-bark-400/70 bg-bark-900/60 hover:border-bark-300/80"
      : entry.status === "active"
        ? "border-evergreen-400/90 bg-evergreen-900/70"
        : "border-evergreen-700/70 bg-evergreen-950/70 hover:border-evergreen-500/80 hover:bg-evergreen-900/50",
    entry.status === "past" && "opacity-60 focus-within:opacity-100 hover:opacity-100",
  );

const Node = ({ entry }: { entry: TimelineEntry }) =>
  entry.finale ? (
    <span className={cx(NODE, "border-bark-200 bg-bark-500 text-bark-50")}>
      <StarIcon className="size-2.5" />
    </span>
  ) : (
    <span className={cx(NODE, NODES[entry.status])}>
      {entry.status === "past" ? <CheckIcon className="size-3" strokeWidth={3} /> : null}
    </span>
  );

const Item = ({ entry, last }: { entry: TimelineEntry; last: boolean }) => {
  const accent = entry.finale
    ? "text-bark-200"
    : entry.status === "active"
      ? "text-evergreen-200"
      : "text-fog-300";
  return (
    <li
      id={entry.id}
      className="relative grid scroll-mt-24 grid-cols-[2.75rem_1fr] gap-4 sm:grid-cols-[5.5rem_1fr] sm:gap-6"
    >
      <div className="relative flex">
        <div
          aria-hidden
          className="hidden flex-col items-end pt-1 font-black font-display text-sm leading-none tracking-tight sm:flex"
        >
          <span className={accent}>{entry.date.primary}</span>
          {entry.date.secondary ? (
            <span className="text-fog-500">{entry.date.secondary}</span>
          ) : null}
          {entry.date.weekday ? (
            <span className="mt-1 font-normal font-sans text-[10px] text-fog-500 uppercase tracking-[0.18em]">
              {entry.date.weekday}
            </span>
          ) : null}
        </div>
        <div
          aria-hidden
          className="absolute top-1 left-0 flex h-full flex-col items-center sm:right-[-1.5rem] sm:left-auto"
        >
          <Node entry={entry} />
          {last ? null : <span className={cx("w-px flex-1", RAIL[entry.status])} />}
        </div>
      </div>
      <div className={last ? undefined : "pb-10"}>
        <article className={cardClasses(entry)}>
          {entry.finale ? <span aria-hidden className="diag-stripes absolute inset-0" /> : null}
          <div className="relative flex flex-wrap items-center gap-2">
            <span className={cx("font-black font-display text-sm tracking-tight", accent)}>
              <span className="sm:sr-only">
                {[entry.date.primary, entry.date.secondary].filter(Boolean).join(" to ")}
              </span>
              <span className="sr-only"> · {STATUS_TEXT[entry.status]}</span>
            </span>
            {entry.tags}
          </div>
          <h3
            className={cx(
              "relative mt-3 font-black font-display text-2xl uppercase tracking-[-0.01em] sm:text-3xl",
              entry.finale ? "text-bark-100" : "text-evergreen-50",
            )}
          >
            {entry.title}
          </h3>
          {entry.blurb ? (
            <p className="relative mt-2 max-w-[58ch] text-fog-200 text-sm leading-relaxed">
              {entry.blurb}
            </p>
          ) : null}
          {entry.meta ? (
            <div className="relative mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {entry.meta}
            </div>
          ) : null}
          {entry.details ? (
            <details open={entry.details.open} className="group/details relative mt-4">
              <summary
                className={cx(
                  "inline-flex cursor-pointer list-none items-center gap-1.5 rounded-sm border border-evergreen-600/60 px-2 py-1 font-mono font-semibold text-[10px] text-evergreen-100 uppercase tracking-[0.16em] hover:border-evergreen-400 hover:text-evergreen-50 [&::-webkit-details-marker]:hidden",
                  FOCUS_RING,
                )}
              >
                {entry.details.summary}
                <ChevronDownIcon className="size-3 transition-transform group-open/details:rotate-180" />
              </summary>
              <div className="mt-4">{entry.details.content}</div>
            </details>
          ) : null}
        </article>
      </div>
    </li>
  );
};

/**
 * @function Timeline
 * @param props {{ entries: readonly TimelineEntry[]; className?: string }} the entries in order
 * @returns {JSX.Element} the ordered timeline
 */
export const Timeline = ({
  entries,
  className,
}: {
  entries: readonly TimelineEntry[];
  className?: string;
}) => (
  <ol className={className}>
    {entries.map((entry, i) => (
      <Item key={entry.id} entry={entry} last={i === entries.length - 1} />
    ))}
  </ol>
);
