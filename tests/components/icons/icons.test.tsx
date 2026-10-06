/**
 * @file tests/components/icons/icons.test.tsx
 * @desc Icon and every named icon: decorative by default, named with a title, paint modes.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "../../../src/components/icons/Icon.js";
import * as icons from "../../../src/components/icons/icons.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

const named = Object.entries(icons).filter(([k]) => k.endsWith("Icon")) as [
  string,
  typeof icons.MenuIcon,
][];

describe("icons", () => {
  it("renders every named icon hidden from screen readers, sized by default", () => {
    for (const [name, Named] of named) {
      const { container, unmount } = render(<Named />);
      const svg = container.querySelector("svg");
      expect(svg, name).toHaveAttribute("aria-hidden", "true");
      expect(svg, name).toHaveClass("size-5");
      expect(Named.displayName).toBe(name);
      unmount();
    }
    expect(named.length).toBe(Object.keys(icons.ICON_SHAPES).length);
  });

  it("names an icon with a title and lets className replace the size", async () => {
    const { container } = render(<icons.DiscordIcon title="Discord" className="size-4" />);
    const img = screen.getByRole("img", { name: "Discord" });
    expect(img.querySelector("title")).toHaveTextContent("Discord");
    expect(img).toHaveClass("size-4");
    expect(img).not.toHaveClass("size-5");
    await expectNoAxeViolations(container);
  });

  it("paints fills and strokes", () => {
    const { container } = render(
      <>
        <Icon shape={icons.ICON_SHAPES.osu} />
        <Icon shape={icons.ICON_SHAPES.menu} />
      </>,
    );
    const [fill, stroke] = container.querySelectorAll("svg");
    expect(fill).toHaveAttribute("fill", "currentColor");
    expect(stroke).toHaveAttribute("stroke", "currentColor");
    expect(stroke?.querySelectorAll("path")).toHaveLength(3);
  });
});
