/**
 * @file src/components/tournament/AvailabilityDisplay.tsx
 * @desc Read-only Fri/Sat/Sun by 24h availability: solid cells for picked hours. Heat mode
 *       (`levels` + `maxLevel`) fades partial-overlap cells for a team; `highlightIds` outlines
 *       one member's hours; `onHoverSlot` reports the hovered slot. A summary line names the
 *       hours for screen readers. Server-safe unless given onHoverSlot.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { cx } from "../../utils/cx.js";
import { DAY_LABELS, DAYS, HOURS, slotId, summarizeAvailability } from "./availability.js";
import {
  CELL_OFF,
  CELL_ON,
  DAY_LABEL,
  GRID_COLUMNS,
  GRID_FRAME,
  HOUR_LABEL,
  showHourLabel,
} from "./gridStyles.js";

/** The picked slots and the optional heat, highlight and hover inputs. */
export type AvailabilityDisplayProps = {
  /** Solid cells; in heat mode, the slots every member shares. */
  ids: readonly string[];
  levels?: Readonly<Record<string, number>> | undefined;
  maxLevel?: number | undefined;
  highlightIds?: readonly string[] | undefined;
  /** Slot id to the names free then, appended to the cell title. */
  slotMembers?: Readonly<Record<string, readonly string[]>> | undefined;
  onHoverSlot?: ((id: string | null) => void) | undefined;
  className?: string | undefined;
};

const RING = "ring-2 ring-cascade-300 ring-inset";

/**
 * @function AvailabilityDisplay
 * @param props {AvailabilityDisplayProps} ids, levels, maxLevel, highlightIds, slotMembers,
 *        onHoverSlot and className
 * @returns {JSX.Element} the grid with a visually hidden summary
 */
export const AvailabilityDisplay = ({
  ids,
  levels,
  maxLevel = 1,
  highlightIds = [],
  slotMembers = {},
  onHoverSlot,
  className,
}: AvailabilityDisplayProps) => {
  const picked = new Set(ids);
  const highlighted = new Set(highlightIds);
  const max = Math.max(maxLevel, 1);
  const cell = (day: (typeof DAYS)[number], hour: number) => {
    const id = slotId(day, hour);
    const on = picked.has(id);
    const level = on ? max : (levels?.[id] ?? 0);
    const names = slotMembers[id]?.join(", ");
    const status = levels
      ? ` — ${level.toString()}/${max.toString()} available`
      : on
        ? " — available"
        : "";
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: a pointer-only hover aid; the summary and titles carry the data
      <span
        key={id}
        data-slot={id}
        title={`${DAY_LABELS[day]} ${HOURS[hour] as string}:00${status}${names ? `: ${names}` : ""}`}
        className={cx(
          "block h-5 rounded-[1px] transition-[box-shadow,opacity] duration-150",
          on || level > 0 ? CELL_ON : CELL_OFF,
          highlighted.has(id) && RING,
          onHoverSlot && "hover:ring-2 hover:ring-cascade-300 hover:ring-inset",
        )}
        style={!on && level > 0 ? { opacity: level / max } : undefined}
        onMouseEnter={onHoverSlot ? () => onHoverSlot(id) : undefined}
      />
    );
  };
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: clears the pointer-only hover aid
    <div
      className={cx(GRID_FRAME, className)}
      onMouseLeave={onHoverSlot ? () => onHoverSlot(null) : undefined}
    >
      <p className="sr-only">{summarizeAvailability(ids)}</p>
      <div aria-hidden>
        <div className="grid items-center gap-px pb-1" style={GRID_COLUMNS}>
          <span />
          {HOURS.map((h, i) => (
            <span key={h} className={HOUR_LABEL}>
              {showHourLabel(i) ? h : ""}
            </span>
          ))}
        </div>
        {DAYS.map((day) => (
          <div key={day} className="grid items-center gap-px" style={GRID_COLUMNS}>
            <span className={DAY_LABEL}>{DAY_LABELS[day]}</span>
            {HOURS.map((_, i) => cell(day, i))}
          </div>
        ))}
      </div>
    </div>
  );
};
