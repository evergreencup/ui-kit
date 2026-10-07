/**
 * @file demo/app/sections.ts
 * @desc The demo's sections, in order, numbered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

export const SECTIONS = [
  { id: "brand", title: "Brand" },
  { id: "basics", title: "Basics" },
  { id: "forms", title: "Forms" },
  { id: "data", title: "Data" },
  { id: "tournament", title: "Tournament" },
  { id: "osu", title: "osu!" },
  { id: "icons", title: "Icons" },
].map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }));

export const section = (id: string) => {
  const found = SECTIONS.find((s) => s.id === id);
  if (!found) throw new Error(`unknown section ${id}`);
  return found;
};
