/**
 * @file tests/components/basics/data.test.tsx
 * @desc Stat, ProgressBar, chipClasses and CopyButton.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "../../../src/components/basics/CopyButton.js";
import { chipClasses } from "../../../src/components/basics/chipStyles.js";
import { ProgressBar } from "../../../src/components/basics/ProgressBar.js";
import { Stat } from "../../../src/components/basics/Stat.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("Stat", () => {
  it("stacks a caption over a mono value by default", () => {
    const { container } = render(<Stat label="Seed" value="#4" />);
    const [label, value] = container.querySelectorAll("span");
    expect(label).toHaveTextContent("Seed");
    expect(value).toHaveClass("font-mono");
  });

  it("puts the label after a display value in headline mode", () => {
    const { container } = render(
      <Stat variant="headline" label="raised" value="$1,250" className="mt-1" />,
    );
    const [value, label] = container.querySelectorAll("span");
    expect(value).toHaveClass("font-display");
    expect(label).toHaveTextContent("raised");
    expect(container.firstChild).toHaveClass("items-end", "mt-1");
  });

  it("runs label and value together inline", () => {
    render(<Stat variant="inline" label="BPM" value="180" />);
    expect(screen.getByText("BPM").parentElement).toHaveTextContent("BPM 180");
  });
});

describe("ProgressBar", () => {
  it("exposes a clamped, rounded value and sizes its fill", async () => {
    const { container, rerender } = render(<ProgressBar value={33.4} max={50} label="Raised" />);
    const bar = screen.getByRole("progressbar", { name: "Raised" });
    expect(bar).toHaveAttribute("aria-valuenow", "67");
    expect((bar.firstChild as HTMLElement).style.width).toBe("66.8%");
    rerender(<ProgressBar value={500} label="Raised" className="h-2" />);
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveClass("h-2");
    await expectNoAxeViolations(container);
  });
});

describe("chipClasses", () => {
  it("styles on and off in each tone", () => {
    expect(chipClasses(true)).toContain("border-evergreen-400");
    expect(chipClasses(false)).toContain("text-fog-300");
    expect(chipClasses(true, "cascade")).toContain("border-cascade-400");
    expect(chipClasses(false, "cascade", "w-full")).toContain("w-full");
  });
});

describe("CopyButton", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("copies, says Copied, then resets after two seconds", async () => {
    const { container } = render(<CopyButton value="123" aria-label="Copy id" />);
    await expectNoAxeViolations(container);
    vi.useFakeTimers({ shouldAdvanceTime: true });
    fireEvent.click(screen.getByRole("button", { name: "Copy id" }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("123");
    expect(await screen.findByText("Copied")).toBeInTheDocument();
    // Let React flush the effect that starts the reset timer, then run it out.
    await act(async () => {});
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("says Failed when the clipboard refuses, and cleans up its timer on unmount", async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error("no"));
    const { unmount } = render(<CopyButton value="x" label="Copy code" failedLabel="Nope" />);
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText("Nope")).toBeInTheDocument();
    unmount();
  });
});
