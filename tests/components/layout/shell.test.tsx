/**
 * @file tests/components/layout/shell.test.tsx
 * @desc SiteHeader (and its skip link), MobileMenu, SiteFooter, PageHero, HeroMediaPlaceholder
 *       and AccountPill.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DiscordIcon } from "../../../src/components/icons/icons.js";
import { AccountPill } from "../../../src/components/layout/AccountPill.js";
import { HeroMediaPlaceholder } from "../../../src/components/layout/HeroMediaPlaceholder.js";
import { MobileMenu } from "../../../src/components/layout/MobileMenu.js";
import { PageHero } from "../../../src/components/layout/PageHero.js";
import { SiteFooter } from "../../../src/components/layout/SiteFooter.js";
import { SiteHeader } from "../../../src/components/layout/SiteHeader.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";
import { route } from "../../helpers/navigation.js";

vi.mock("next/navigation.js", async () => (await import("../../helpers/navigation.js")).navMock);

const NAV = [
  { href: "/rules", label: "Rules" },
  { href: "/pools", label: "Pools" },
];
const CTA = { href: "/register", label: "Register" };
const ACCOUNT = { href: "/signin", label: "Sign in" };

describe("SiteHeader", () => {
  it("links home, lists the nav, shows actions and the call to action", async () => {
    route.pathname = "/rules";
    const { container } = render(
      <SiteHeader
        items={NAV}
        cta={CTA}
        account={ACCOUNT}
        actions={<a href="https://discord.gg/x">Discord</a>}
        mobileExtras={<p>extra</p>}
        className="top-2"
      />,
    );
    expect(screen.getByRole("link", { name: "Evergreen Cup, home" })).toHaveAttribute("href", "/");
    const main = screen.getByRole("navigation", { name: "Main" });
    expect(within(main).getByRole("link", { name: "Rules" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getAllByRole("link", { name: "Register" })[0]).toHaveClass("bg-evergreen-500");
    expect(screen.getByRole("link", { name: "Discord" })).toBeInTheDocument();
    expect(container.querySelector("header")).toHaveClass("top-2");
    await expectNoAxeViolations(container);
  });

  it("works with only the nav", () => {
    render(<SiteHeader items={NAV} />);
    expect(screen.queryByRole("link", { name: "Register" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Skip to content" })).toBeNull();
  });

  it("puts a skip link first when given skipTo", async () => {
    const user = userEvent.setup();
    const { container } = render(<SiteHeader items={NAV} skipTo="#content" />);
    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip).toHaveAttribute("href", "#content");
    expect(skip).toHaveClass("sr-only", "focus:not-sr-only");
    await user.tab();
    expect(skip).toHaveFocus();
    await expectNoAxeViolations(container);
  });
});

describe("MobileMenu", () => {
  it("opens the drawer, locks scroll and closes on Escape, backdrop and the close button", async () => {
    route.pathname = "/";
    const user = userEvent.setup();
    render(
      <MobileMenu items={NAV} cta={CTA} account={ACCOUNT}>
        <a href="https://discord.gg/x">Join the Discord</a>
      </MobileMenu>,
    );
    const toggle = screen.getByRole("button", { name: "Open menu" });
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("inert");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(dialog).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("hidden");
    expect(within(dialog).getByRole("link", { name: "Register" })).toHaveClass("rounded-full");
    expect(within(dialog).getByRole("link", { name: "Sign in" })).toHaveClass(
      "border-evergreen-700",
    );
    expect(within(dialog).getByRole("link", { name: "Join the Discord" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
    await user.click(toggle);
    fireEvent.click(document.querySelector('[aria-hidden="true"].fixed') as Element);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    await user.click(within(dialog).getByRole("button", { name: "Close menu" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("moves focus into the drawer, wraps Tab at both ends and hands it back on close", async () => {
    route.pathname = "/";
    const user = userEvent.setup();
    render(
      <MobileMenu items={NAV} cta={CTA}>
        <a href="https://discord.gg/x">Join the Discord</a>
      </MobileMenu>,
    );
    const toggle = screen.getByRole("button", { name: "Open menu" });
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(toggle).toHaveAttribute("aria-controls", dialog.id);
    await user.click(toggle);
    const close = within(dialog).getByRole("button", { name: "Close menu" });
    const last = within(dialog).getByRole("link", { name: "Join the Discord" });
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(close).not.toHaveFocus();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard("{Escape}");
    expect(toggle).toHaveFocus();
  });

  it("renders only the toggle on the server", () => {
    const html = renderToString(<MobileMenu items={NAV} />);
    expect(html).toContain("Open menu");
    expect(html).not.toContain("dialog");
  });

  it("closes when the route changes and renders without a cta or account", async () => {
    route.pathname = "/a";
    const { rerender } = render(<MobileMenu items={NAV} />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    route.pathname = "/b";
    act(() => rerender(<MobileMenu items={NAV} />));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("link", { name: "Register", hidden: true })).toBeNull();
  });
});

describe("SiteFooter", () => {
  const COLUMNS = [
    {
      title: "Tournament",
      items: [
        { href: "/lan", label: "LAN" },
        { href: "/schedule", label: "Schedule" },
        { href: "https://forum.test", label: "Forum post" },
      ],
    },
  ];

  it("shows the brand, tapered columns, socials and the legal line", async () => {
    const { container } = render(
      <SiteFooter
        columns={COLUMNS}
        socials={[{ name: "Discord", href: "https://d.test", icon: DiscordIcon }]}
        year={2026}
      />,
    );
    expect(screen.getByText("Evergreen Cup")).toBeInTheDocument();
    const links = within(
      screen.getByRole("heading", { name: "Tournament" }).parentElement as HTMLElement,
    ).getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(["Forum post ↗", "Schedule", "LAN"]);
    expect(screen.getByText(/© 2026 Evergreen Cup\. Not affiliated/)).toBeInTheDocument();
    expect(screen.getByText(/Washington · Oregon/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Discord" })).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("keeps column order, custom tagline and regions, no socials", () => {
    render(<SiteFooter columns={COLUMNS} taper={false} tagline="Hi" regions={["WA"]} />);
    expect(screen.getAllByRole("link").map((l) => l.textContent)[0]).toBe("LAN");
    expect(screen.getByText("Hi")).toBeInTheDocument();
    expect(screen.getByText("WA")).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear().toString()}`)),
    ).toBeInTheDocument();
  });
});

describe("PageHero", () => {
  it("renders the h1 with eyebrow, lead and actions over the default gradient", async () => {
    const { container } = render(
      <PageHero eyebrow="Brand" eyebrowTone="cascade" title="The look" lead="Colors and type">
        <a href="/x">Act</a>
      </PageHero>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "The look" })).toBeInTheDocument();
    expect(screen.getByText("Brand")).toHaveClass("text-cascade-300");
    expect(container.querySelector(".from-cascade-900\\/30")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Act" })).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("takes a media backdrop and the tall size", () => {
    const { container } = render(
      <PageHero title="T" size="tall" media={<HeroMediaPlaceholder label="Pools" />} />,
    );
    expect(container.querySelector("section > div:last-child")).toHaveClass("min-h-[24rem]");
    expect(container.querySelector(".from-cascade-900\\/30")).toBeNull();
    expect(screen.getByText("Pools")).toBeInTheDocument();
    expect(screen.getByText("Evergreen Cup")).toBeInTheDocument();
  });
});

describe("HeroMediaPlaceholder", () => {
  it("shows a custom edition line", () => {
    render(<HeroMediaPlaceholder label="Teams" edition="Evergreen Cup · 2026" />);
    expect(screen.getByText("Evergreen Cup · 2026")).toBeInTheDocument();
  });
});

describe("AccountPill", () => {
  it("shows the avatar, name and admin badge, linking to the dashboard", async () => {
    const { container, rerender } = render(
      <AccountPill username="haruhime" avatarUrl="https://a.ppy.sh/1" isAdmin className="ml-2" />,
    );
    const link = screen.getByRole("link", { name: /haruhime/ });
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveClass("ml-2");
    expect(container.querySelector("img")).toHaveAttribute("src", "https://a.ppy.sh/1");
    expect(screen.getByText("admin")).toBeInTheDocument();
    await expectNoAxeViolations(container);
    rerender(<AccountPill username="x" href="/me" />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.queryByText("admin")).toBeNull();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/me");
  });
});
