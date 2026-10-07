/**
 * @file demo/app/Interactive.tsx
 * @desc The stateful demos: every form control and the availability picker, wired to local state
 *       so a visitor can try them.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import {
  AvailabilityDisplay,
  AvailabilityGrid,
  Checkbox,
  ChoiceChips,
  OptionCards,
  Select,
  Textarea,
  TextInput,
  ToggleChips,
} from "@evergreencup/ui-kit";
import { useState } from "react";

const REGIONS = [
  { value: "wa", label: "Washington" },
  { value: "or", label: "Oregon" },
  { value: "bc", label: "British Columbia" },
  { value: "id", label: "Idaho" },
  { value: "ak", label: "Alaska" },
];

export function FormsDemo() {
  const [region, setRegion] = useState("");
  const [mods, setMods] = useState<string[]>(["HD"]);
  const [role, setRole] = useState<"player" | "staff" | null>("player");
  const [extras, setExtras] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <TextInput
        id="demo-username"
        label="osu! username"
        hint="The one on your profile."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={username.includes(" ") ? "Usernames here have no spaces." : undefined}
      />
      <Select
        id="demo-region"
        label="Region"
        placeholder="Pick one"
        value={region}
        options={REGIONS}
        onChange={setRegion}
      />
      <Textarea id="demo-note" label="Anything else" hint="Optional." rows={3} />
      <div className="flex flex-col gap-6">
        <ChoiceChips
          label="Signing up as"
          value={role}
          onChange={setRole}
          options={[
            { value: "player", label: "Player" },
            { value: "staff", label: "Staff", tone: "cascade" },
          ]}
        />
        <ToggleChips
          label="Favorite mods (up to 2)"
          max={2}
          selected={mods}
          onChange={setMods}
          options={["HD", "HR", "DT", "FL", "EZ"].map((m) => ({ value: m, label: m }))}
        />
        <Checkbox id="demo-pnw" label="I live in the Pacific Northwest" />
      </div>
      <div className="md:col-span-2">
        <OptionCards
          label="Extras"
          selected={extras}
          onChange={setExtras}
          columns={3}
          options={[
            { value: "room", label: "Hotel room", blurb: "Split with your team." },
            { value: "shirt", label: "Event shirt", blurb: "Printed in Seattle." },
            {
              value: "pass",
              label: "Spectator pass",
              blurb: "For friends who came along.",
              disabled: true,
              lockedReason: "Sold out",
            },
          ]}
        />
      </div>
    </div>
  );
}

const TEAM = ["sat-14", "sat-15", "sat-16", "sat-17", "sun-12", "sun-13", "sun-14"];

export function AvailabilityDemo() {
  const [mine, setMine] = useState<string[]>(["sat-15", "sat-16", "sun-13"]);
  const levels = Object.fromEntries([...TEAM, ...mine].map((id) => [id, 0]));
  for (const id of [...TEAM, ...mine]) levels[id] = (levels[id] ?? 0) + 1;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <AvailabilityGrid selected={mine} onChange={setMine} />
      <AvailabilityDisplay
        ids={Object.keys(levels)}
        levels={levels}
        maxLevel={2}
        highlightIds={mine.filter((id) => TEAM.includes(id))}
      />
    </div>
  );
}
