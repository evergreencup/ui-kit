/**
 * @file tests/components/forms/fields.test.tsx
 * @desc FormField, fieldControlProps, TextInput, Textarea, Checkbox and fieldClasses.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "../../../src/components/forms/Checkbox.js";
import { FormField, fieldControlProps } from "../../../src/components/forms/FormField.js";
import { fieldClasses } from "../../../src/components/forms/fieldStyles.js";
import { Textarea } from "../../../src/components/forms/Textarea.js";
import { TextInput } from "../../../src/components/forms/TextInput.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("fieldControlProps", () => {
  it("links the error over the hint, keeps the caller's ids, and flags invalid", () => {
    expect(fieldControlProps({ id: "a" })).toEqual({
      id: "a",
      "aria-describedby": undefined,
      "aria-invalid": undefined,
    });
    expect(fieldControlProps({ id: "a", hint: "h", describedBy: "x" })["aria-describedby"]).toBe(
      "a-hint x",
    );
    expect(fieldControlProps({ id: "a", hint: "h", error: "e" })).toEqual({
      id: "a",
      "aria-describedby": "a-error",
      "aria-invalid": true,
    });
  });
});

describe("TextInput", () => {
  it("labels the input, links its hint and marks it required", async () => {
    const { container } = render(
      <TextInput id="name" label="osu! username" hint="As on your profile" required />,
    );
    const input = screen.getByRole("textbox", { name: "osu! username" });
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription("As on your profile");
    expect(container.querySelector("label span")).toHaveTextContent("*");
    await expectNoAxeViolations(container);
  });

  it("shows an error instead of the hint and lists hint lines", () => {
    const { rerender } = render(<TextInput id="n" label="Name" hint="h" error="Required" />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription("Required");
    expect(input).toHaveClass("border-red-400/70");
    expect(screen.queryByText("h")).toBeNull();
    rerender(<TextInput id="n" label="Name" hint={["one", "two"]} />);
    expect(screen.getByText("one").tagName).toBe("P");
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("renders bare without a label, inline style and a hidden label", () => {
    const { container, rerender } = render(
      <TextInput id="q" aria-label="Search" variant="inline" className="w-40" />,
    );
    expect(container.firstChild?.nodeName).toBe("INPUT");
    expect(screen.getByRole("textbox")).toHaveClass("border-b", "w-40");
    rerender(
      <TextInput id="q" label="Search" hideLabel labelStyle="mono" wrapperClassName="mt-2" />,
    );
    expect(screen.getByText("Search")).toHaveClass("sr-only", "font-mono");
    expect(container.firstChild).toHaveClass("mt-2");
  });

  it("types like an input", async () => {
    const onChange = vi.fn();
    render(<TextInput id="t" label="T" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "ab");
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});

describe("Textarea", () => {
  it("labels a resizable boxed textarea, or a bare inline one", async () => {
    const { container, rerender } = render(
      <Textarea id="notes" label="Anything else" error="Too long" />,
    );
    const ta = screen.getByRole("textbox", { name: "Anything else" });
    expect(ta).toHaveClass("resize-y", "min-h-24");
    expect(ta).toBeInvalid();
    await expectNoAxeViolations(container);
    rerender(<Textarea id="notes" aria-label="Notes" variant="inline" />);
    expect(container.firstChild?.nodeName).toBe("TEXTAREA");
    expect(screen.getByRole("textbox")).not.toHaveClass("min-h-24");
  });
});

describe("FormField", () => {
  it("wraps any control", () => {
    render(
      <FormField id="x" label="Pick">
        <select id="x">
          <option>a</option>
        </select>
      </FormField>,
    );
    expect(screen.getByRole("combobox", { name: "Pick" })).toBeInTheDocument();
  });
});

describe("Checkbox", () => {
  it("toggles from anywhere on its row", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Checkbox id="c" label="I used to live in the PNW" onChange={onChange} className="mt-1" />,
    );
    await userEvent.click(screen.getByText("I used to live in the PNW"));
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(container.firstChild).toHaveClass("mt-1");
    await expectNoAxeViolations(container);
  });
});

describe("fieldClasses", () => {
  it("defaults to the boxed control", () => {
    expect(fieldClasses()).toContain("rounded-sm");
    expect(fieldClasses("inline", true)).toContain("border-red-400/70");
  });
});
