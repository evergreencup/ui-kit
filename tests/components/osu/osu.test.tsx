/**
 * @file tests/components/osu/osu.test.tsx
 * @desc osu! links, mod colors, ModTag, PlayerIdentity and BeatmapRow.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BeatmapRow, type BeatmapSlot } from "../../../src/components/osu/BeatmapRow.js";
import { ModTag } from "../../../src/components/osu/ModTag.js";
import { MOD_BUCKETS, MOD_COLORS, modColor } from "../../../src/components/osu/modColors.js";
import {
  beatmapUrl,
  coverUrl,
  GUEST_AVATAR,
  profileUrl,
  slotLabel,
} from "../../../src/components/osu/osuLinks.js";
import { PlayerIdentity } from "../../../src/components/osu/PlayerIdentity.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

const SLOT: BeatmapSlot = {
  mod: "HD",
  index: 2,
  beatmapId: 123,
  beatmapsetId: 45,
  artist: "xi",
  title: "FREEDOM DiVE",
  difficulty: "FOUR DIMENSIONS",
  mapperName: "Nakagawa-Kanon",
  mapperOsuId: 87065,
  starRating: 7.0712,
  bpm: 222,
  lengthSeconds: 263,
  cs: 4,
  ar: 9.3,
  od: 8,
  hp: 6,
  notes: "Warmup",
};

describe("osu links and mod colors", () => {
  it("builds osu! URLs and slot labels", () => {
    expect(profileUrl(2)).toBe("https://osu.ppy.sh/users/2");
    expect(beatmapUrl(3)).toBe("https://osu.ppy.sh/b/3");
    expect(coverUrl(4)).toBe("https://assets.ppy.sh/beatmaps/4/covers/cover.jpg");
    expect(slotLabel("NM", 1)).toBe("NM1");
  });

  it("colors every bucket and falls back to NM", () => {
    for (const mod of MOD_BUCKETS) expect(modColor(mod)).toBe(MOD_COLORS[mod]);
    expect(modColor("EZ")).toBe(MOD_COLORS.NM);
  });
});

describe("ModTag", () => {
  it("prints the slot in the mod's color", () => {
    const { rerender } = render(<ModTag mod="DT" index={3} className="text-xs" />);
    const tag = screen.getByText("DT3");
    expect(tag).toHaveStyle({ color: MOD_COLORS.DT.hex });
    expect(tag).toHaveClass("text-xs");
    rerender(<ModTag mod="TB" />);
    expect(screen.getByText("TB")).toBeInTheDocument();
  });
});

describe("PlayerIdentity", () => {
  it("links the name to the profile with a note and sub-line", async () => {
    const { container } = render(
      <PlayerIdentity
        username="mrekk"
        osuId={7562902}
        avatarUrl="https://a.ppy.sh/7562902"
        note="captain"
        sub="Washington"
        size="md"
        highlight
        className="mt-1"
      />,
    );
    const link = screen.getByRole("link", { name: "mrekk" });
    expect(link).toHaveAttribute("href", profileUrl(7562902));
    expect(link).toHaveClass("text-cascade-300");
    expect(container.querySelector("img")).toHaveClass("size-10");
    expect(screen.getByText("captain")).toBeInTheDocument();
    expect(screen.getByText("Washington")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("mt-1");
    await expectNoAxeViolations(container);
  });

  it("falls back to plain text and the guest avatar", () => {
    const { container } = render(<PlayerIdentity username="guest" osuId={null} avatarUrl={null} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("guest")).toHaveClass("text-evergreen-50");
    expect(container.querySelector("img")).toHaveAttribute("src", GUEST_AVATAR);
  });
});

describe("BeatmapRow", () => {
  it("shows the slot, map link, mapper link, notes, stats and a copy button", async () => {
    const { container } = render(
      <ul>
        <BeatmapRow slot={SLOT} />
      </ul>,
    );
    expect(screen.getByText("HD2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "xi - FREEDOM DiVE" })).toHaveAttribute(
      "href",
      beatmapUrl(123),
    );
    expect(screen.getByRole("link", { name: "Nakagawa-Kanon" })).toHaveAttribute(
      "href",
      profileUrl(87065),
    );
    expect(screen.getByText("Warmup")).toBeInTheDocument();
    expect(screen.getByText("7.07★")).toBeInTheDocument();
    expect(screen.getByText("BPM").parentElement).toHaveTextContent("BPM 222");
    expect(screen.getByText("LEN").parentElement).toHaveTextContent("LEN 4:23");
    expect(screen.getByRole("button", { name: "Copy map id 123" })).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("src", coverUrl(45));
    expect((container.querySelector("li > span") as HTMLElement).style.backgroundColor).toBe(
      "rgb(227, 181, 63)",
    );
    await expectNoAxeViolations(container);
  });

  it("handles a mapper without an id, a mapper id without a name, and no mapper", () => {
    const { rerender, container } = render(
      <ul>
        <BeatmapRow slot={{ ...SLOT, mapperOsuId: null, notes: null }} />
      </ul>,
    );
    expect(screen.getByText(/· Nakagawa-Kanon/)).toBeInTheDocument();
    expect(screen.queryByText("Warmup")).toBeNull();
    rerender(
      <ul>
        <BeatmapRow slot={{ ...SLOT, mapperName: null }} />
      </ul>,
    );
    expect(screen.getByRole("link", { name: "mapper" })).toBeInTheDocument();
    rerender(
      <ul>
        <BeatmapRow slot={{ ...SLOT, mapperName: null, mapperOsuId: null, notes: null }} />
      </ul>,
    );
    expect(container.querySelector("li")?.textContent).toContain("[FOUR DIMENSIONS]7.07★");
  });
});
