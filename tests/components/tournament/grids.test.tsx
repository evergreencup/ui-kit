/**
 * @file tests/components/tournament/grids.test.tsx
 * @desc AvailabilityDisplay (plain, heat, highlight, hover) and AvailabilityGrid (click, keys,
 *       rows, columns, drag).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AvailabilityDisplay } from "../../../src/components/tournament/AvailabilityDisplay.js";
import { AvailabilityGrid } from "../../../src/components/tournament/AvailabilityGrid.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

const cell = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-slot="${id}"]`) as HTMLElement;

describe("AvailabilityDisplay", () => {
  it("fills picked hours and summarizes them for screen readers", async () => {
    const { container } = render(
      <AvailabilityDisplay ids={["fri-18", "fri-19"]} className="mt-2" />,
    );
    expect(cell(container, "fri-18")).toHaveClass("bg-evergreen-500");
    expect(cell(container, "fri-18")).toHaveAttribute("title", "Fri 18:00 — available");
    expect(cell(container, "sat-00")).toHaveClass("bg-evergreen-900/60");
    expect(cell(container, "sat-00")).toHaveAttribute("title", "Sat 00:00");
    expect(screen.getByText("Fri 18–19")).toHaveClass("sr-only");
    expect(container.querySelectorAll("[data-slot]")).toHaveLength(72);
    expect(container.firstChild).toHaveClass("mt-2");
    await expectNoAxeViolations(container);
  });

  it("fades partial overlap in heat mode, outlines highlights and reports hover", () => {
    const onHover = vi.fn();
    const { container } = render(
      <AvailabilityDisplay
        ids={["sat-01"]}
        levels={{ "sat-02": 1 }}
        maxLevel={2}
        highlightIds={["sat-02"]}
        slotMembers={{ "sat-02": ["a"], "sat-03": [] }}
        onHoverSlot={onHover}
      />,
    );
    expect(cell(container, "sat-01")).toHaveAttribute("title", "Sat 01:00 — 2/2 available");
    const partial = cell(container, "sat-02");
    expect(partial).toHaveStyle({ opacity: "0.5" });
    expect(partial).toHaveClass("ring-2");
    expect(partial).toHaveAttribute("title", "Sat 02:00 — 1/2 available: a");
    expect(cell(container, "sat-03")).toHaveAttribute("title", "Sat 03:00 — 0/2 available");
    fireEvent.mouseEnter(partial);
    expect(onHover).toHaveBeenCalledWith("sat-02");
    fireEvent.mouseLeave(container.firstChild as Element);
    expect(onHover).toHaveBeenLastCalledWith(null);
  });

  it("treats a zero max as one", () => {
    const { container } = render(<AvailabilityDisplay ids={[]} levels={{}} maxLevel={0} />);
    expect(cell(container, "fri-00")).toHaveAttribute("title", "Fri 00:00 — 0/1 available");
  });
});

describe("AvailabilityGrid", () => {
  const Harness = ({ disabled }: { disabled?: boolean }) => {
    const [sel, setSel] = useState<string[]>([]);
    return <AvailabilityGrid selected={sel} onChange={setSel} disabled={disabled} />;
  };
  const hour = (name: string) => screen.getByRole("button", { name });

  it("toggles cells by mouse and keyboard, and says how many are picked", async () => {
    const { container } = render(<Harness />);
    expect(screen.getByText("drag to paint, or click individual hours")).toBeInTheDocument();
    fireEvent.mouseDown(hour("Fri 18:00"));
    fireEvent.mouseUp(window);
    expect(hour("Fri 18:00")).toHaveAttribute("aria-pressed", "true");
    fireEvent.mouseEnter(hour("Fri 19:00"));
    expect(screen.getByText("Fri · 19:00")).toBeInTheDocument();
    fireEvent.mouseLeave(hour("Fri 19:00"));
    expect(screen.getByText("1 hour picked")).toBeInTheDocument();
    hour("Sat 00:00").focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{a}");
    await userEvent.keyboard(" ");
    await userEvent.keyboard(" ");
    expect(hour("Sat 00:00")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("2 hours picked")).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("paints a rectangle by dragging, and erases from a picked cell", () => {
    render(<Harness />);
    fireEvent.mouseDown(hour("Fri 01:00"));
    fireEvent.mouseEnter(hour("Sat 02:00"));
    fireEvent.mouseUp(window);
    for (const n of ["Fri 01:00", "Fri 02:00", "Sat 01:00", "Sat 02:00"])
      expect(hour(n)).toHaveAttribute("aria-pressed", "true");
    fireEvent.mouseEnter(hour("Sun 05:00"));
    expect(hour("Sun 05:00")).toHaveAttribute("aria-pressed", "false");
    fireEvent.mouseDown(hour("Fri 01:00"));
    fireEvent.mouseEnter(hour("Fri 02:00"));
    fireEvent.mouseUp(window);
    expect(hour("Fri 01:00")).toHaveAttribute("aria-pressed", "false");
    expect(hour("Fri 02:00")).toHaveAttribute("aria-pressed", "false");
    expect(hour("Sat 01:00")).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles a whole day and a whole hour", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Toggle all of Sun" }));
    expect(hour("Sun 23:00")).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Toggle 12:00 on every day" }));
    expect(hour("Fri 12:00")).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Toggle 12:00 on every day" }));
    expect(hour("Sun 12:00")).toHaveAttribute("aria-pressed", "false");
  });

  it("disables everything and takes a custom hint", () => {
    render(<AvailabilityGrid selected={[]} onChange={vi.fn()} disabled emptyHint="Pick hours" />);
    expect(hour("Fri 00:00")).toBeDisabled();
    expect(screen.getByText("Pick hours")).toBeInTheDocument();
  });
});
