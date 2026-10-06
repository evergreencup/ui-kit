/**
 * @file tests/components/forms/Select.test.tsx
 * @desc Select: mouse, keyboard, outside click, hidden input, labels and axe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Select, type SelectOption } from "../../../src/components/forms/Select.js";
import { listboxKey } from "../../../src/components/forms/selectKeys.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

const OPTIONS: SelectOption[] = [
  { value: "-08:00", label: "UTC-08:00" },
  { value: "-07:00", label: "UTC-07:00" },
  { value: "+00:00", label: "UTC+00:00" },
];

const Harness = (props: Partial<Parameters<typeof Select>[0]>) => {
  const [value, setValue] = useState("");
  return (
    <Select
      id="tz"
      label="UTC offset"
      value={value}
      options={OPTIONS}
      onChange={setValue}
      name="utcOffset"
      {...props}
    />
  );
};

describe("listboxKey", () => {
  it("moves, clamps, jumps, commits and closes", () => {
    expect(listboxKey("ArrowDown", 0, 3)).toEqual({ type: "move", index: 1 });
    expect(listboxKey("ArrowDown", 2, 3)).toEqual({ type: "move", index: 2 });
    expect(listboxKey("ArrowUp", 0, 3)).toEqual({ type: "move", index: 0 });
    expect(listboxKey("Home", 2, 3)).toEqual({ type: "move", index: 0 });
    expect(listboxKey("End", 0, 3)).toEqual({ type: "move", index: 2 });
    expect(listboxKey("End", 0, 0)).toEqual({ type: "move", index: 0 });
    expect(listboxKey(" ", 0, 3)).toEqual({ type: "commit" });
    expect(listboxKey("Enter", 0, 3)).toEqual({ type: "commit" });
    expect(listboxKey("Escape", 0, 3)).toEqual({ type: "close" });
    expect(listboxKey("Tab", 0, 3)).toEqual({ type: "close" });
    expect(listboxKey("a", 0, 3)).toEqual({ type: "none" });
  });
});

describe("Select", () => {
  it("opens on click, picks with the mouse and carries the value in a hidden input", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    const trigger = screen.getByRole("button", { name: /UTC offset/ });
    expect(trigger).toHaveTextContent("Select…");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.hover(screen.getByRole("option", { name: "UTC-07:00" }));
    await user.click(screen.getByRole("option", { name: "UTC-07:00" }));
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger).toHaveTextContent("UTC-07:00");
    expect(container.querySelector('input[type="hidden"]')).toHaveValue("-07:00");
    await user.click(trigger);
    expect(screen.getByRole("option", { name: "UTC-07:00" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expectNoAxeViolations(container);
    await user.click(trigger);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{x}");
    expect(screen.queryByRole("listbox")).toBeNull();
    await user.keyboard("{ArrowDown}");
    const list = screen.getByRole("listbox");
    expect(list).toHaveFocus();
    await user.keyboard("{End}{ArrowUp}{q}{Enter}");
    expect(trigger).toHaveTextContent("UTC-07:00");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("closes on an outside click, stays shut when disabled, and takes a placeholder and aria-label", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <div>
        <Select
          id="m"
          aria-label="Mod"
          value="zz"
          options={OPTIONS}
          onChange={onChange}
          placeholder="Any mod"
          variant="inline"
          className="w-40"
        />
        <p>outside</p>
      </div>,
    );
    const trigger = screen.getByRole("button", { name: "Mod" });
    expect(trigger).toHaveTextContent("Any mod");
    expect(trigger).toHaveClass("border-b");
    await user.click(trigger);
    fireEvent.mouseDown(screen.getByText("outside"));
    expect(screen.queryByRole("listbox")).toBeNull();
    rerender(
      <Select
        id="m"
        aria-label="Mod"
        value=""
        options={OPTIONS}
        onChange={onChange}
        disabled
        error="Pick one"
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("commits nothing for an empty option list", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Select id="e" aria-label="Empty" value="" options={[]} onChange={onChange} />);
    await user.click(screen.getByRole("button"));
    await user.keyboard("{Enter}");
    expect(onChange).not.toHaveBeenCalled();
  });
});
