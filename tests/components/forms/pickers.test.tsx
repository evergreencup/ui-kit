/**
 * @file tests/components/forms/pickers.test.tsx
 * @desc ToggleChips, ChoiceChips, OptionCards, ChipButton and toggleValue.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ChoiceChips } from "../../../src/components/forms/ChoiceChips.js";
import { toggleValue } from "../../../src/components/forms/chipGroupStyles.js";
import { OptionCards } from "../../../src/components/forms/OptionCards.js";
import { ToggleChips } from "../../../src/components/forms/ToggleChips.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

type Skill = "aim" | "speed" | "tech";
const SKILLS = [
  { value: "aim" as const, label: "Aim" },
  { value: "speed" as const, label: "Speed" },
  { value: "tech" as const, label: "Tech", disabled: true },
];

describe("toggleValue", () => {
  it("adds, removes and respects max", () => {
    expect(toggleValue(["a"], "b")).toEqual(["a", "b"]);
    expect(toggleValue(["a", "b"], "a")).toEqual(["b"]);
    expect(toggleValue(["a"], "b", 1)).toEqual(["a"]);
  });
});

describe("ToggleChips", () => {
  const Harness = ({ max }: { max?: number }) => {
    const [sel, setSel] = useState<Skill[]>([]);
    return (
      <ToggleChips
        label="Skillsets"
        options={SKILLS}
        selected={sel}
        onChange={setSel}
        max={max}
        columns={2}
        tone="cascade"
      />
    );
  };

  it("toggles chips in a labeled group and caps at max", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness max={1} />);
    expect(screen.getByRole("group", { name: "Skillsets" })).toHaveClass("sm:grid-cols-2");
    const aim = screen.getByRole("button", { name: "Aim" });
    await user.click(aim);
    expect(aim).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Speed" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Tech" })).toBeDisabled();
    await user.click(aim);
    expect(aim).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Speed" })).toBeEnabled();
    await expectNoAxeViolations(container);
  });

  it("disables every chip when the group is disabled", () => {
    render(<ToggleChips label="S" options={SKILLS} selected={[]} onChange={vi.fn()} disabled />);
    expect(screen.getByRole("button", { name: "Aim" })).toBeDisabled();
    expect(screen.getByRole("group")).toHaveClass("sm:grid-cols-3");
  });
});

describe("ChoiceChips", () => {
  it("picks one choice, in each option's tone", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <ChoiceChips
        label="Region"
        value="WA"
        onChange={onChange}
        className="mt-2"
        options={[
          { value: "WA", label: "WA · Washington" },
          { value: "OTHER", label: "Outside the PNW", tone: "cascade" },
          { value: "AK", label: "AK", disabled: true },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "WA · Washington" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const other = screen.getByRole("button", { name: "Outside the PNW" });
    expect(other).toHaveClass("text-cascade-200");
    await userEvent.click(other);
    expect(onChange).toHaveBeenCalledWith("OTHER");
    expect(screen.getByRole("button", { name: "AK" })).toBeDisabled();
    expect(screen.getByRole("group")).toHaveClass("mt-2");
    await expectNoAxeViolations(container);
  });

  it("disables the row", () => {
    render(
      <ChoiceChips
        label="R"
        value={null}
        onChange={vi.fn()}
        disabled
        options={[{ value: "a", label: "A" }]}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("OptionCards", () => {
  it("toggles cards, shows a lock reason and checks the picked ones", async () => {
    const Harness = () => {
      const [sel, setSel] = useState<string[]>(["ref"]);
      return (
        <OptionCards
          label="Roles"
          selected={sel}
          onChange={setSel}
          columns={3}
          options={[
            { value: "ref", label: "Referee", blurb: "Runs matches" },
            {
              value: "test",
              label: "Playtester",
              blurb: "Plays pools",
              lockedReason: "You're already playing",
            },
            { value: "gfx", label: "Graphics", blurb: "Makes art", disabled: true },
          ]}
        />
      );
    };
    const { container } = render(<Harness />);
    const ref = screen.getByRole("button", { name: /Referee/ });
    expect(ref).toHaveAttribute("aria-pressed", "true");
    expect(ref.querySelector("svg")).toBeInTheDocument();
    await userEvent.click(ref);
    expect(ref).toHaveAttribute("aria-pressed", "false");
    const locked = screen.getByRole("button", { name: /Playtester/ });
    expect(locked).toBeDisabled();
    expect(locked).toHaveTextContent("You're already playing");
    expect(screen.getByRole("button", { name: /Graphics/ })).toBeDisabled();
    await expectNoAxeViolations(container);
  });

  it("disables every card", () => {
    render(
      <OptionCards
        label="R"
        selected={[]}
        onChange={vi.fn()}
        disabled
        options={[{ value: "a", label: "A", blurb: "b" }]}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
