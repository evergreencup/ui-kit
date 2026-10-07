/**
 * @file tests/components/layout/comingSoon.test.tsx
 * @desc ComingSoon, ComingSoonNote, SubmitButton (with a real form action) and SignInWithOsu.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BRAND } from "../../../src/brand/identity.js";
import { SubmitButton } from "../../../src/components/forms/SubmitButton.js";
import { ComingSoon } from "../../../src/components/layout/ComingSoon.js";
import { ComingSoonNote } from "../../../src/components/layout/ComingSoonNote.js";
import { SignInWithOsu } from "../../../src/components/osu/SignInWithOsu.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("ComingSoon", () => {
  it("defaults to the brand and holds actions", async () => {
    const { container } = render(
      <ComingSoon className="min-h-dvh">
        <a href="/discord">Discord</a>
      </ComingSoon>,
    );
    expect(screen.getByRole("heading", { level: 1, name: BRAND.name })).toBeInTheDocument();
    expect(screen.getByText(BRAND.kicker)).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveClass("min-h-dvh");
    await expectNoAxeViolations(container);
  });

  it("takes its own copy and skips the action row", () => {
    const { container } = render(
      <ComingSoon as="section" eyebrow="Soon" title="EGC 2027" lead="Later." />,
    );
    expect(screen.getByText("Later.")).toBeInTheDocument();
    expect(container.querySelector("main")).toBeNull();
    expect(container.querySelector("section")?.children).toHaveLength(3);
  });
});

describe("ComingSoonNote", () => {
  it("shows the default and custom notes", async () => {
    const { container, rerender } = render(<ComingSoonNote />);
    expect(screen.getByText("In the workshop")).toBeInTheDocument();
    await expectNoAxeViolations(container);
    rerender(<ComingSoonNote title="Soon">Pools next week.</ComingSoonNote>);
    expect(screen.getByText("Pools next week.")).toBeInTheDocument();
  });
});

describe("SubmitButton", () => {
  it("goes pending while the form action runs", async () => {
    const user = userEvent.setup();
    let finish = () => {};
    const action = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { container } = render(
      <form action={action}>
        <SubmitButton>Register</SubmitButton>
      </form>,
    );
    const button = screen.getByRole("button", { name: "Register" });
    expect(button).toHaveAttribute("type", "submit");
    await expectNoAxeViolations(container);
    await user.click(button);
    expect(await screen.findByRole("button", { name: "Submitting…" })).toBeDisabled();
    await act(async () => {
      finish();
    });
    expect(await screen.findByRole("button", { name: "Register" })).toBeEnabled();
  });

  it("goes pending when told to", () => {
    render(
      <SubmitButton pending pendingLabel="Saving" size="sm">
        Save
      </SubmitButton>,
    );
    expect(screen.getByRole("button", { name: "Saving" })).toHaveAttribute("aria-busy", "true");
  });
});

describe("SignInWithOsu", () => {
  it("links to a sign-in route", async () => {
    const { container } = render(<SignInWithOsu href="/signin" />);
    const link = screen.getByRole("link", { name: "Sign in with osu!" });
    expect(link).toHaveAttribute("href", "/signin");
    expect(link).toHaveClass("bg-pink-600", "rounded-full");
    await expectNoAxeViolations(container);
  });

  it("runs a handler and shows its pending state", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <SignInWithOsu onClick={onClick} pill={false} size="md">
        Continue with osu!
      </SignInWithOsu>,
    );
    await user.click(screen.getByRole("button", { name: "Continue with osu!" }));
    expect(onClick).toHaveBeenCalledOnce();
    rerender(<SignInWithOsu onClick={onClick} pending />);
    expect(screen.getByRole("button", { name: "Redirecting…" })).toBeDisabled();
  });
});
