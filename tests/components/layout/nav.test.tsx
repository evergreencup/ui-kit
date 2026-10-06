/**
 * @file tests/components/layout/nav.test.tsx
 * @desc isActivePath, byLabelLength, NavLink and SocialLinks.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DiscordIcon, OsuIcon } from "../../../src/components/icons/icons.js";
import { NavLink } from "../../../src/components/layout/NavLink.js";
import { byLabelLength, isActivePath } from "../../../src/components/layout/nav.js";
import { SocialLinks } from "../../../src/components/layout/SocialLinks.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";
import { route } from "../../helpers/navigation.js";

vi.mock("next/navigation.js", async () => (await import("../../helpers/navigation.js")).navMock);

describe("nav helpers", () => {
  it("matches a route and its sub-pages, and / only itself", () => {
    expect(isActivePath("/rules", "/rules")).toBe(true);
    expect(isActivePath("/rules/format", "/rules")).toBe(true);
    expect(isActivePath("/rulesets", "/rules")).toBe(false);
    expect(isActivePath("/rules", "/")).toBe(false);
    expect(isActivePath("/", "/")).toBe(true);
  });

  it("sorts longest label first without touching the input", () => {
    const items = [
      { href: "/a", label: "LAN" },
      { href: "/b", label: "Schedule" },
    ];
    expect(byLabelLength(items).map((i) => i.label)).toEqual(["Schedule", "LAN"]);
    expect(items[0]?.label).toBe("LAN");
  });
});

describe("NavLink", () => {
  it("marks the current page with aria-current and the underline", () => {
    route.pathname = "/pools/qualifiers";
    render(
      <>
        <NavLink href="/pools">Pools</NavLink>
        <NavLink href="/rules" className="px-1" inactiveClassName="text-fog-400">
          Rules
        </NavLink>
        <NavLink href="/pools/qualifiers" underline={false} activeClassName="text-cascade-50">
          Q
        </NavLink>
      </>,
    );
    const pools = screen.getByRole("link", { name: "Pools" });
    expect(pools).toHaveAttribute("aria-current", "page");
    expect(pools).toHaveClass("active-underline", "text-evergreen-50");
    const rules = screen.getByRole("link", { name: "Rules" });
    expect(rules).not.toHaveAttribute("aria-current");
    expect(rules).toHaveClass("px-1", "text-fog-400");
    expect(screen.getByRole("link", { name: "Q" })).not.toHaveClass("active-underline");
  });
});

describe("SocialLinks", () => {
  it("links live accounts and dims pending ones", async () => {
    const { container } = render(
      <SocialLinks
        className="gap-1"
        itemClassName="size-8"
        links={[
          { name: "Discord", href: "https://discord.gg/x", icon: DiscordIcon },
          { name: "osu! forum", href: "", icon: OsuIcon },
        ]}
      />,
    );
    const discord = screen.getByRole("link", { name: "Discord" });
    expect(discord).toHaveAttribute("target", "_blank");
    expect(discord).toHaveClass("size-8");
    const pending = screen.getByRole("img", { name: "osu! forum (link pending)" });
    expect(pending).toHaveClass("opacity-40");
    expect(container.firstChild).toHaveClass("gap-1");
    await expectNoAxeViolations(container);
  });
});
