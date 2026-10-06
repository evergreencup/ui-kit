/**
 * @file tests/components/tournament/tournament.test.tsx
 * @desc StatusBadge, StretchTiers, FundingMeter and RosterCard.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FundingMeter } from "../../../src/components/tournament/FundingMeter.js";
import { RosterCard } from "../../../src/components/tournament/RosterCard.js";
import { StatusBadge } from "../../../src/components/tournament/StatusBadge.js";
import { StretchTiers } from "../../../src/components/tournament/StretchTiers.js";
import { STATUSES } from "../../../src/components/tournament/statuses.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

const TIERS = [
  { thresholdCents: 200_000, label: "Prize boost", description: "More prizes" },
  { thresholdCents: 50_000, label: "Stream kit", description: "Better stream" },
];

describe("StatusBadge", () => {
  it("wears each status's tone and label", () => {
    const { rerender } = render(<StatusBadge status="waitlisted" />);
    expect(screen.getByText("waitlist")).toHaveClass("text-cascade-100");
    rerender(<StatusBadge status="approved" label="in" pill />);
    expect(screen.getByText("in")).toHaveClass("text-evergreen-100", "rounded-full");
    expect(Object.keys(STATUSES)).toHaveLength(8);
  });
});

describe("StretchTiers", () => {
  it("sorts tiers, places ticks and marks cleared ones", () => {
    const { container } = render(
      <StretchTiers goalCents={100_000} raisedCents={60_000} tiers={TIERS} />,
    );
    const ticks = container.querySelectorAll("[aria-hidden] > span");
    expect((ticks[0] as HTMLElement).style.left).toBe("25%");
    expect(ticks[0]).toHaveClass("bg-evergreen-400");
    expect(ticks[1]).toHaveClass("bg-fog-500/60");
    const cards = screen.getAllByRole("listitem");
    expect(cards[0]).toHaveTextContent("$500 · cleared");
    expect(cards[1]).toHaveTextContent("$2,000");
    expect(cards[1]).not.toHaveTextContent("cleared");
  });

  it("scales to at least 1 with no goal or tiers", () => {
    const { container } = render(<StretchTiers goalCents={0} raisedCents={0} tiers={[]} />);
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });
});

describe("FundingMeter", () => {
  it("shows the total over the goal, progress, tiers and the call to action", async () => {
    const { container } = render(
      <FundingMeter raisedCents={60_000} goalCents={100_000} count={12} tiers={TIERS}>
        <h2>Fund the Cup</h2>
      </FundingMeter>,
    );
    expect(screen.getByText("Goal")).toBeInTheDocument();
    expect(screen.getByText("$600")).toBeInTheDocument();
    expect(screen.getByText("/ $1,000")).toBeInTheDocument();
    expect(screen.getByText("012 contributions so far")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Crowdfund progress" })).toHaveAttribute(
      "aria-valuenow",
      "60",
    );
    expect(screen.getByText("60% of goal")).toBeInTheDocument();
    expect(screen.getByText("Stream kit")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fund the Cup" })).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("says Goal pending without a goal, one contribution, no tiers or block", () => {
    render(<FundingMeter raisedCents={500} goalCents={null} count={1} />);
    expect(screen.getByText("Goal pending")).toBeInTheDocument();
    expect(screen.getByText("001 contribution so far")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("skips the tier list when the goal has none", () => {
    render(<FundingMeter raisedCents={0} goalCents={1000} count={0} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByRole("list")).toBeNull();
  });
});

describe("RosterCard", () => {
  it("shows the tag in the team color, the roster with captains and a footer", async () => {
    const { container } = render(
      <RosterCard
        tag="SEA"
        name="Rain City"
        color="#00759c"
        note="withdrawn"
        footer={<p>Availability</p>}
        members={[
          { username: "cap", osuId: 1, isCaptain: true },
          { username: "two", osuId: null },
        ]}
      />,
    );
    expect(screen.getByText("SEA")).toHaveStyle({ color: "#00759c" });
    expect(screen.getByRole("heading", { level: 2, name: "Rain City" })).toBeInTheDocument();
    expect(screen.getByText("withdrawn")).toBeInTheDocument();
    expect(screen.getAllByText("captain")).toHaveLength(1);
    expect(screen.getByText("Availability").parentElement).toHaveClass("border-t");
    await expectNoAxeViolations(container);
  });

  it("drops the color, note and footer when absent", () => {
    const { container } = render(<RosterCard tag="X" name="Y" members={[]} level={3} />);
    expect(screen.getByText("X")).not.toHaveAttribute("style");
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    expect(container.querySelector(".border-t")).toBeNull();
  });
});
