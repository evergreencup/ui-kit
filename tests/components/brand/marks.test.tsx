/**
 * @file tests/components/brand/marks.test.tsx
 * @desc ConiferGlyph, MapleLeafGlyph, Wordmark, HeaderWordmark, PnwArrows, Lockup, SprigStripe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConiferGlyph } from "../../../src/components/brand/ConiferGlyph.js";
import { HeaderWordmark } from "../../../src/components/brand/HeaderWordmark.js";
import { Lockup } from "../../../src/components/brand/Lockup.js";
import { MapleLeafGlyph } from "../../../src/components/brand/MapleLeafGlyph.js";
import { PnwArrows } from "../../../src/components/brand/PnwArrows.js";
import { SprigStripe } from "../../../src/components/brand/SprigStripe.js";
import { Wordmark } from "../../../src/components/brand/Wordmark.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("glyphs", () => {
  it("draws the conifer crown and trunk with overridable colors", () => {
    const { container } = render(
      <ConiferGlyph className="size-8" trunkClassName="text-bark-300" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("size-8", "text-evergreen-400");
    expect(container.querySelector("rect")).toHaveClass("text-bark-300");
  });

  it("draws the maple leaf", () => {
    const { container } = render(<MapleLeafGlyph className="size-4" />);
    expect(container.querySelector("path")).toHaveAttribute("opacity", "0.78");
  });
});

describe("Wordmark", () => {
  it("shows the glyph and full name by default", async () => {
    const { container } = render(<Wordmark className="scale-125" />);
    expect(screen.getByText("Evergreen Cup")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("scale-125");
    await expectNoAxeViolations(container);
  });

  it("shows only EGC, or only the named glyph", () => {
    const { container, rerender } = render(<Wordmark variant="short" />);
    expect(screen.getByText("EGC")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeNull();
    rerender(<Wordmark variant="icon" />);
    expect(screen.getByRole("img", { name: "Evergreen Cup" })).toBeInTheDocument();
    expect(screen.queryByText("EGC")).toBeNull();
  });

  it("rolls EGC out and the glyph in on group hover", () => {
    const { container } = render(<HeaderWordmark />);
    expect(screen.getByText("EGC")).toHaveClass(
      "group-hover:-translate-y-full",
      "motion-reduce:transition-none",
    );
    expect(container.querySelector("svg")?.parentElement).toHaveClass("translate-y-full");
  });
});

describe("PnwArrows and Lockup", () => {
  it("strokes chevrons and fills the compass", () => {
    const { container, rerender } = render(<PnwArrows />);
    expect(container.querySelector("svg")).toHaveAttribute("stroke", "currentColor");
    expect(container.querySelectorAll("path")).toHaveLength(4);
    rerender(<PnwArrows variant="compass" className="size-10" />);
    expect(container.querySelector("svg")).toHaveAttribute("fill", "currentColor");
    expect(container.querySelectorAll("path")).toHaveLength(5);
  });

  it("puts the wordmark over either motif", () => {
    const { container, rerender } = render(<Lockup />);
    expect(container.querySelector("svg")).toHaveClass("text-evergreen-500/45");
    rerender(<Lockup variant="compass" className="h-64" />);
    expect(container.querySelector("svg")).toHaveClass("size-56");
    expect(container.firstChild).toHaveClass("h-64");
    expect(screen.getByText("Evergreen Cup")).toBeInTheDocument();
  });
});

describe("SprigStripe", () => {
  it("tiles the sprig across the top", () => {
    const { container } = render(<SprigStripe className="opacity-50" fill="#000000" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveClass("opacity-50");
    expect(el.style.backgroundRepeat).toBe("repeat-x");
    expect(el.style.backgroundSize).toBe("48px 12px");
  });
});
