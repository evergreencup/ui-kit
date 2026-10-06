/**
 * @file tests/components/basics/Button.test.tsx
 * @desc Button, ButtonLink and buttonClasses: variants, sizes, pill, pending, links.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../../../src/components/basics/Button.js";
import { ButtonLink } from "../../../src/components/basics/ButtonLink.js";
import { buttonClasses } from "../../../src/components/basics/buttonStyles.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("Button", () => {
  it("defaults to a primary type=button with the focus ring", () => {
    render(<Button>Go</Button>);
    const b = screen.getByRole("button", { name: "Go" });
    expect(b).toHaveAttribute("type", "button");
    expect(b).toHaveClass("bg-evergreen-500", "rounded-sm", "uppercase", "focus-visible:ring-2");
  });

  it("keeps an explicit type and merges className last", () => {
    render(
      <Button type="submit" className="px-9">
        Send
      </Button>,
    );
    const b = screen.getByRole("button");
    expect(b).toHaveAttribute("type", "submit");
    expect(b).toHaveClass("px-9");
    expect(b).not.toHaveClass("px-5");
  });

  it("shows the pending label, disables and marks busy", async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Button pending onClick={onClick}>
        Save
      </Button>,
    );
    const b = screen.getByRole("button", { name: "Working…" });
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute("aria-busy", "true");
    rerender(
      <Button pending pendingLabel="Submitting…" disabled={false}>
        Save
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Submitting…" })).toBeEnabled();
    rerender(<Button onClick={onClick}>Save</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Button>One</Button>
        <Button variant="outline">Two</Button>
        <Button variant="icon" aria-label="Three">
          3
        </Button>
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});

describe("ButtonLink", () => {
  it("renders an internal link with button classes", () => {
    render(
      <ButtonLink href="/register" variant="outline" pill>
        Register
      </ButtonLink>,
    );
    const a = screen.getByRole("link", { name: "Register" });
    expect(a).toHaveAttribute("href", "/register");
    expect(a).toHaveClass("border-evergreen-700", "rounded-full");
  });
});

describe("buttonClasses", () => {
  it("builds each variant and size", () => {
    expect(buttonClasses({ variant: "ghost" })).toContain("text-fog-300");
    expect(buttonClasses({ variant: "osu", pill: true })).toContain("bg-pink-500");
    expect(buttonClasses({ size: "sm" })).toContain("text-[10px]");
    expect(buttonClasses({ size: "lg" })).toContain("text-sm");
    const icon = buttonClasses({ variant: "icon", size: "lg" });
    expect(icon).toContain("size-9");
    expect(icon).not.toContain("px-6");
  });
});
