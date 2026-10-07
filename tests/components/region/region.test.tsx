/**
 * @file tests/components/region/region.test.tsx
 * @desc The region data, RegionMap's highlights, and RegionPicker's mouse, keyboard, chip,
 *       "Outside the PNW" and disabled paths.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { REGIONS } from "../../../src/brand/identity.js";
import { RegionMap } from "../../../src/components/region/RegionMap.js";
import { RegionPicker } from "../../../src/components/region/RegionPicker.js";
import { PROVINCE_PATHS, STATE_PATHS } from "../../../src/components/region/regionPaths.js";
import {
  CONTEXT_PATHS,
  OUTSIDE_PNW,
  REGION_ISO,
  REGION_LOOK,
  type RegionChoice,
  regionPath,
} from "../../../src/components/region/regions.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("region data", () => {
  it("has a path for every region and leaves them out of the context", () => {
    for (const r of REGIONS) expect(regionPath(r)).toMatch(/^M/);
    expect(regionPath("British Columbia")).toBe(PROVINCE_PATHS["CA-BC"]);
    expect(regionPath("Alaska")).toBe(STATE_PATHS["US-AK"]);
    const isos = new Set(CONTEXT_PATHS.map(([iso]) => iso));
    for (const iso of Object.values(REGION_ISO)) expect(isos.has(iso)).toBe(false);
    expect(isos.size).toBe(
      Object.keys(STATE_PATHS).length + Object.keys(PROVINCE_PATHS).length - 5,
    );
  });
});

describe("RegionMap", () => {
  it("lights every region by default as one labeled image", async () => {
    const { container } = render(<RegionMap className="max-w-sm" />);
    const map = screen.getByRole("img", {
      name: /Washington, Oregon, Idaho, British Columbia, Alaska/,
    });
    expect(map).toHaveClass("max-w-sm");
    expect(container.querySelectorAll('[data-lit="true"]')).toHaveLength(5);
    await expectNoAxeViolations(container);
  });

  it("dims the regions it isn't highlighting and takes a title", () => {
    const { container } = render(<RegionMap highlight={["Oregon"]} title="Where we are" />);
    expect(screen.getByRole("img", { name: "Where we are" })).toBeInTheDocument();
    expect(container.querySelector('[data-region="Oregon"]')).toHaveAttribute("data-lit", "true");
    expect(container.querySelector('[data-region="Idaho"]')).toHaveAttribute("data-lit", "false");
  });
});

const Harness = ({ allowOutside, disabled }: { allowOutside?: boolean; disabled?: boolean }) => {
  const [value, setValue] = useState<RegionChoice | null>(null);
  return (
    <RegionPicker
      value={value}
      onChange={setValue}
      allowOutside={allowOutside}
      disabled={disabled}
      className="mt-2"
    />
  );
};

describe("RegionPicker", () => {
  it("picks by click, names the hovered region and syncs the chips", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    const group = screen.getByRole("radiogroup", { name: "State or province of residence" });
    expect(group).toBeInTheDocument();
    expect(screen.getByText("Pick your state or province")).toBeInTheDocument();
    const oregon = screen.getByRole("radio", { name: "Oregon" });
    fireEvent.mouseEnter(oregon);
    expect(screen.getByText("Oregon", { selector: "p" })).toBeInTheDocument();
    expect(oregon).toHaveAttribute("fill", REGION_LOOK.hover.fill);
    fireEvent.mouseLeave(oregon);
    await user.click(oregon);
    expect(oregon).toHaveAttribute("aria-checked", "true");
    expect(oregon).toHaveAttribute("fill", REGION_LOOK.on.fill);
    expect(oregon).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("button", { name: "Oregon" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Idaho" }));
    expect(screen.getByRole("radio", { name: "Idaho" })).toHaveAttribute("aria-checked", "true");
    expect(screen.queryByRole("button", { name: OUTSIDE_PNW })).toBeNull();
    await expectNoAxeViolations(container);
  });

  it("moves and picks with the keyboard", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toHaveAttribute("tabindex", "0");
    await user.tab();
    expect(radios[0]).toHaveFocus();
    expect(screen.getByText("Washington", { selector: "p" })).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(radios[1]).toHaveFocus();
    expect(radios[1]).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{End}");
    expect(radios[4]).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{Home}");
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{ArrowLeft}");
    expect(radios[4]).toHaveFocus();
    await user.keyboard("x");
    expect(radios[4]).toHaveFocus();
    fireEvent.keyDown(radios[2] as Element, { key: "Enter" });
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
    fireEvent.keyDown(radios[3] as Element, { key: " " });
    expect(radios[3]).toHaveAttribute("aria-checked", "true");
    fireEvent.blur(radios[3] as Element);
    expect(screen.getByText("British Columbia", { selector: "p" })).toBeInTheDocument();
  });

  it("offers Outside the PNW", async () => {
    const user = userEvent.setup();
    render(<Harness allowOutside />);
    await user.click(screen.getByRole("button", { name: OUTSIDE_PNW }));
    expect(screen.getByText(OUTSIDE_PNW, { selector: "p" })).toBeInTheDocument();
    for (const r of screen.getAllByRole("radio"))
      expect(r).toHaveAttribute("aria-checked", "false");
  });

  it("ignores input while disabled", () => {
    const onChange = vi.fn();
    render(<RegionPicker value="Oregon" onChange={onChange} disabled label="Home" prompt="Pick" />);
    const oregon = screen.getByRole("radio", { name: "Oregon" });
    expect(oregon).toHaveAttribute("tabindex", "-1");
    fireEvent.click(oregon);
    fireEvent.keyDown(oregon, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Idaho" })).toBeDisabled();
    expect(screen.getByRole("radiogroup", { name: "Home" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
