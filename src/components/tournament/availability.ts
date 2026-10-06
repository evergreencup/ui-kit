/**
 * @file src/components/tournament/availability.ts
 * @desc The tournament weekend's availability model: Fri, Sat and Sun by 24 hours, slot ids
 *       like "sat-14", range toggles for rows, columns and drags, a heat count across members,
 *       and a screen-reader summary ("Fri 18–23 · Sat 00–03"). Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** The weekend's days, in order. */
export const DAYS = ["fri", "sat", "sun"] as const;

/** One day. */
export type Day = (typeof DAYS)[number];

/** Short day labels. */
export const DAY_LABELS: Record<Day, string> = { fri: "Fri", sat: "Sat", sun: "Sun" };

/** The 24 hours as zero-padded strings, "00" to "23". */
export const HOURS: readonly string[] = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

/**
 * @function slotId
 * @param day {Day} the day
 * @param hour {number} 0 to 23
 * @returns {string} the slot id, e.g. "sat-14"
 */
export const slotId = (day: Day, hour: number): string =>
  `${day}-${hour.toString().padStart(2, "0")}`;

/**
 * @function rangeIds
 * @param from {{ day: Day; hour: number }} one corner
 * @param to {{ day: Day; hour: number }} the opposite corner
 * @returns {string[]} every slot id in the rectangle between them, either order
 */
export const rangeIds = (
  from: { day: Day; hour: number },
  to: { day: Day; hour: number },
): string[] => {
  const [d0, d1] = [DAYS.indexOf(from.day), DAYS.indexOf(to.day)].sort((a, b) => a - b) as [
    number,
    number,
  ];
  const [h0, h1] = [from.hour, to.hour].sort((a, b) => a - b) as [number, number];
  return DAYS.slice(d0, d1 + 1).flatMap((day) =>
    Array.from({ length: h1 - h0 + 1 }, (_, i) => slotId(day, h0 + i)),
  );
};

/**
 * @function toggleIds
 * @param selected {readonly string[]} the current selection
 * @param ids {readonly string[]} a group of slots (a row, a column)
 * @returns {string[]} the group removed when all of it was selected, added otherwise
 */
export const toggleIds = (selected: readonly string[], ids: readonly string[]): string[] => {
  const set = new Set(selected);
  const all = ids.every((id) => set.has(id));
  for (const id of ids) {
    if (all) set.delete(id);
    else set.add(id);
  }
  return [...set];
};

/**
 * @function applyIds
 * @param base {readonly string[]} the selection before a drag
 * @param ids {readonly string[]} the slots the drag covers
 * @param mode {"add" | "remove"} what the drag does
 * @returns {string[]} base with the slots added or removed
 */
export const applyIds = (
  base: readonly string[],
  ids: readonly string[],
  mode: "add" | "remove",
): string[] => {
  const set = new Set(base);
  for (const id of ids) {
    if (mode === "add") set.add(id);
    else set.delete(id);
  }
  return [...set];
};

/**
 * @function overlapLevels
 * @param sets {readonly (readonly string[])[]} each member's slots
 * @returns {Record<string, number>} slot id to how many members are free then
 */
export const overlapLevels = (sets: readonly (readonly string[])[]): Record<string, number> => {
  const levels: Record<string, number> = {};
  for (const ids of sets) for (const id of new Set(ids)) levels[id] = (levels[id] ?? 0) + 1;
  return levels;
};

/**
 * @function fullOverlap
 * @param sets {readonly (readonly string[])[]} each member's slots
 * @returns {string[]} the slots every member shares (none for no members)
 */
export const fullOverlap = (sets: readonly (readonly string[])[]): string[] => {
  const levels = overlapLevels(sets);
  return Object.keys(levels).filter((id) => levels[id] === sets.length);
};

const runs = (hours: number[]): string[] => {
  const out: string[] = [];
  let start = hours[0] as number;
  hours.forEach((h, i) => {
    const next = hours[i + 1];
    if (next !== h + 1) {
      const pad = (n: number) => n.toString().padStart(2, "0");
      out.push(start === h ? pad(h) : `${pad(start)}–${pad(h)}`);
      if (next !== undefined) start = next;
    }
  });
  return out;
};

/**
 * @function summarizeAvailability
 * @param ids {readonly string[]} slot ids
 * @returns {string} each day's hour runs, e.g. "Fri 18–23 · Sat 00–03", or "No hours picked"
 */
export const summarizeAvailability = (ids: readonly string[]): string => {
  const parts = DAYS.flatMap((day) => {
    const hours = ids
      .filter((id) => id.startsWith(`${day}-`))
      .map((id) => Number(id.slice(4)))
      .sort((a, b) => a - b);
    return hours.length > 0 ? [`${DAY_LABELS[day]} ${runs(hours).join(", ")}`] : [];
  });
  return parts.length > 0 ? parts.join(" · ") : "No hours picked";
};
