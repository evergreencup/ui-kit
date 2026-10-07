/**
 * @file demo/app/Interactive.tsx
 * @desc The stateful demos: every form control, the availability and region pickers, the banner
 *       picker and a submitting form, wired to local state so a visitor can try them.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

"use client";

import {
  AvailabilityDisplay,
  AvailabilityGrid,
  BannerPicker,
  Checkbox,
  ChoiceChips,
  OptionCards,
  type RegionChoice,
  RegionPicker,
  Select,
  SignInWithOsu,
  SubmitButton,
  Textarea,
  TextInput,
  ToggleChips,
} from "@evergreencup/ui-kit";
import { useState } from "react";
import { BANNER_VARIANTS } from "./samples";

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

export function RegionDemo() {
  const [region, setRegion] = useState<RegionChoice | null>("Washington");
  return <RegionPicker value={region} onChange={setRegion} allowOutside className="max-w-xl" />;
}

export function BannerDemo() {
  const [variant, setVariant] = useState("frost");
  const [name, setName] = useState("cedar");
  return (
    <div className="flex flex-col gap-4">
      <TextInput
        id="demo-banner-name"
        label="Name on the banner"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <BannerPicker
        variants={BANNER_VARIANTS}
        name={name}
        subtitle="Founding donor"
        value={variant}
        onChange={setVariant}
      />
    </div>
  );
}

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 1500));

export function SubmitDemo() {
  const [signingIn, setSigningIn] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <form action={wait}>
        <SubmitButton>Submit (waits 1.5s)</SubmitButton>
      </form>
      <SignInWithOsu
        pending={signingIn}
        onClick={() => {
          setSigningIn(true);
          setTimeout(() => setSigningIn(false), 1500);
        }}
      />
    </div>
  );
}
