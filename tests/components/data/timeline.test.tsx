/**
 * @file tests/components/data/timeline.test.tsx
 * @desc Timeline (statuses, finale, details, dates), StatBand and TwitchEmbed.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StatBand } from "../../../src/components/data/StatBand.js";
import { Timeline, type TimelineEntry } from "../../../src/components/data/Timeline.js";
import { TwitchEmbed, twitchPlayerUrl } from "../../../src/components/data/TwitchEmbed.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

const ENTRIES: TimelineEntry[] = [
  {
    id: "quals",
    title: "Qualifiers",
    status: "past",
    date: { primary: "Sep 5", secondary: "Sep 6", weekday: "Sat" },
    tags: <span>Round</span>,
  },
  {
    id: "ro16",
    title: "Round of 16",
    status: "active",
    date: { primary: "Sep 19" },
    blurb: "Sixteen teams.",
    meta: <span>Best of 9</span>,
    details: { summary: "2 matches", content: <p>Match list</p> },
  },
  {
    id: "qf",
    title: "Quarterfinals",
    status: "next",
    date: { primary: "Oct 3" },
    details: { summary: "1 match", content: <p>Open list</p>, open: true },
  },
  { id: "sf", title: "Semifinals", status: "future", date: { primary: "Oct 10" } },
  {
    id: "lan",
    title: "Grand Finals",
    status: "future",
    finale: true,
    date: { primary: "Oct 24", secondary: "Oct 25" },
  },
];

describe("Timeline", () => {
  it("renders each entry in order with anchors, status and dates for screen readers", async () => {
    const { container } = render(<Timeline entries={ENTRIES} className="mt-12" />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveAttribute("id", "quals");
    expect(within(items[0] as HTMLElement).getByText("Sep 5 to Sep 6")).toBeInTheDocument();
    expect(within(items[0] as HTMLElement).getByText("· Done")).toBeInTheDocument();
    expect(within(items[1] as HTMLElement).getByText("· Happening now")).toBeInTheDocument();
    // Past cards dim their surface, not their text, so the text keeps its contrast.
    expect(items[0]?.querySelector("article")).toHaveClass("bg-evergreen-950/40");
    expect(items[0]?.querySelector("article")).not.toHaveClass("opacity-60");
    expect(items[1]?.querySelector("article")).toHaveClass("border-evergreen-400/90");
    expect(items[4]?.querySelector(".diag-stripes")).toBeInTheDocument();
    expect(items[4]?.querySelector("h3")).toHaveClass("text-bark-100");
    expect(items[4]?.querySelectorAll(".w-px")).toHaveLength(0);
    expect(items[0]?.querySelectorAll(".w-px")).toHaveLength(1);
    expect(container.firstChild).toHaveClass("mt-12");
    expect(screen.getByText("Best of 9")).toBeInTheDocument();
    expect(screen.getByText("Sixteen teams.")).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("expands details on click and honors open", async () => {
    render(<Timeline entries={ENTRIES} />);
    const [closed, open] = document.querySelectorAll("details");
    expect(closed).not.toHaveAttribute("open");
    expect(open).toHaveAttribute("open");
    await userEvent.click(screen.getByText("2 matches"));
    expect(closed).toHaveAttribute("open");
  });
});

describe("StatBand", () => {
  it("lists labeled values", async () => {
    const { container } = render(
      <StatBand
        className="mt-2"
        items={[
          { label: "Right now", value: "Round of 16" },
          { label: "Progress", value: "3 of 7" },
        ]}
      />,
    );
    expect(screen.getByText("Right now").tagName).toBe("DT");
    expect(screen.getByText("3 of 7").tagName).toBe("DD");
    expect(container.firstChild).toHaveClass("mt-2");
    await expectNoAxeViolations(container);
  });
});

describe("TwitchEmbed", () => {
  it("builds the player URL with every parent and frames it", async () => {
    expect(twitchPlayerUrl("evergreencup", ["evergreencup.org", "localhost"])).toBe(
      "https://player.twitch.tv/?channel=evergreencup&muted=true&autoplay=true&parent=evergreencup.org&parent=localhost",
    );
    const { container, rerender } = render(
      <TwitchEmbed channel="evergreencup" parents={["evergreencup.org"]} />,
    );
    expect(screen.getByTitle("evergreencup on Twitch")).toHaveClass("aspect-video");
    expect(container.firstChild).not.toHaveClass("max-w-sm");
    rerender(<TwitchEmbed channel="x" parents={[]} variant="mini" className="mt-1" />);
    expect(container.firstChild).toHaveClass("max-w-sm", "mt-1");
    await expectNoAxeViolations(container);
  });
});
