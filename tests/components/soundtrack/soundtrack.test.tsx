/**
 * @file tests/components/soundtrack/soundtrack.test.tsx
 * @desc The embed helpers, TrackPlayer per provider, and TrackCard's cover, meta and credits.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { creditSeparator, TrackCard } from "../../../src/components/soundtrack/TrackCard.js";
import { TrackPlayer } from "../../../src/components/soundtrack/TrackPlayer.js";
import {
  guessProvider,
  soundcloudPlayerUrl,
  youtubeId,
} from "../../../src/components/soundtrack/trackEmbeds.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("track embeds", () => {
  it("pulls YouTube ids from every URL shape", () => {
    expect(youtubeId("https://youtu.be/abc")).toBe("abc");
    expect(youtubeId("https://youtu.be/")).toBeNull();
    expect(youtubeId("https://www.youtube.com/watch?v=xyz")).toBe("xyz");
    expect(youtubeId("https://www.youtube.com/watch")).toBeNull();
    expect(youtubeId("https://youtube.com/embed/e1")).toBe("e1");
    expect(youtubeId("https://youtube.com/shorts/s1")).toBe("s1");
    expect(youtubeId("https://youtube.com/channel/c")).toBeNull();
    expect(youtubeId("https://youtube.com/embed")).toBeNull();
    expect(youtubeId("https://vimeo.com/1")).toBeNull();
    expect(youtubeId("not a url")).toBeNull();
  });

  it("builds the SoundCloud widget and guesses providers", () => {
    const src = soundcloudPlayerUrl("https://soundcloud.com/a/b");
    expect(src).toMatch(/^https:\/\/w\.soundcloud\.com\/player\/\?url=https%3A%2F%2Fsoundcloud/);
    expect(src).toContain("auto_play=false");
    expect(guessProvider("https://youtu.be/abc")).toBe("youtube");
    expect(guessProvider("https://soundcloud.com/a/b")).toBe("soundcloud");
    expect(guessProvider("https://cdn.example/t.mp3?x=1")).toBe("direct");
    expect(guessProvider("https://bandcamp.com/t")).toBe("link");
  });
});

describe("TrackPlayer", () => {
  it("renders nothing without a URL", () => {
    const { container } = render(<TrackPlayer url={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("embeds YouTube and SoundCloud and plays files", () => {
    const { rerender, container } = render(
      <TrackPlayer url="https://youtu.be/abc" title="Cascadia" />,
    );
    expect(screen.getByTitle("Cascadia on YouTube")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/abc",
    );
    rerender(<TrackPlayer url="https://soundcloud.com/a/b" provider="soundcloud" />);
    expect(screen.getByTitle("Track on SoundCloud")).toBeInTheDocument();
    rerender(<TrackPlayer url="/t.ogg" provider="direct" title="Rain" />);
    expect(container.querySelector("audio")).toHaveAttribute("aria-label", "Rain");
  });

  it("falls back to a Listen link, including a YouTube URL with no video", async () => {
    const { container, rerender } = render(<TrackPlayer url="https://bandcamp.com/t" />);
    expect(screen.getByRole("link", { name: "Listen" })).toHaveAttribute("target", "_blank");
    await expectNoAxeViolations(container);
    rerender(<TrackPlayer url="https://youtube.com/channel/c" provider="youtube" />);
    expect(screen.getByRole("link", { name: "Listen" })).toBeInTheDocument();
  });
});

describe("TrackCard", () => {
  it("joins credits", () => {
    expect([0, 1, 2].map((i) => creditSeparator(i, 3))).toEqual([", ", " & ", ""]);
  });

  it("shows cover, meta, linked and plain credits and the player", async () => {
    const { container } = render(
      <TrackCard
        track={{
          index: 1,
          title: "Cascadia",
          roundLabel: "Qualifiers",
          lengthSeconds: 95,
          coverUrl: "https://cdn.example/c.jpg",
          audioUrl: "https://youtu.be/abc",
        }}
        songwriters={[{ name: "salal", href: "/contributors#salal" }, { name: "drizzle" }]}
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Cascadia" })).toBeInTheDocument();
    expect(screen.getByText("Track 01 · Qualifiers · 1:35")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Cascadia cover art" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "salal" })).toHaveAttribute(
      "href",
      "/contributors#salal",
    );
    expect(screen.getByText("drizzle").tagName).toBe("SPAN");
    await expectNoAxeViolations(container);
  });

  it("falls back to the number tile and Untitled", () => {
    render(<TrackCard track={{ index: 7 }} level={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Untitled" })).toBeInTheDocument();
    expect(screen.getByText("Track 07")).toBeInTheDocument();
    expect(screen.getByText("07")).toBeInTheDocument();
  });
});
