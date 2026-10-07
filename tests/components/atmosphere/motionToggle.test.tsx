/**
 * @file tests/components/atmosphere/motionToggle.test.tsx
 * @desc MotionToggle and the motion pause store: pausing every layer, persistence, blocked
 *       storage, and hiding under reduced motion.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroVideo } from "../../../src/components/atmosphere/HeroVideo.js";
import { MapleLeafDrift } from "../../../src/components/atmosphere/MapleLeafDrift.js";
import { MotionToggle } from "../../../src/components/atmosphere/MotionToggle.js";
import { MOTION_PAUSE_KEY, setMotionPaused } from "../../../src/hooks/useMotionPause.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";
import { REDUCE, setMedia } from "../../helpers/media.js";

afterEach(() => {
  act(() => {
    setMotionPaused(false);
  });
  window.localStorage.clear();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("MotionToggle", () => {
  it("pauses the video and the leaf together, saves the choice, and resumes", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <HeroVideo poster="/p.jpg" mp4="/v.mp4" />
        <MapleLeafDrift />
        <MotionToggle className="absolute right-3" />
      </div>,
    );
    const toggle = screen.getByRole("button", { name: "Pause background motion" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveClass("absolute", "right-3");
    expect(container.querySelector("video")).not.toBeNull();
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("title", "Play background motion");
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector(".leaf-drift")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute("src", "/p.jpg");
    expect(window.localStorage.getItem(MOTION_PAUSE_KEY)).toBe("1");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(container.querySelector("video")).not.toBeNull();
    expect(window.localStorage.getItem(MOTION_PAUSE_KEY)).toBe("0");
  });

  it("has no axe violations", async () => {
    // Alone: axe stalls on jsdom's <video>.
    const { container } = render(<MotionToggle />);
    await expectNoAxeViolations(container);
  });

  it("renders nothing under reduced motion", () => {
    act(() => setMedia(REDUCE, true));
    const { container } = render(<MotionToggle label="Pause" />);
    expect(container.firstChild).toBeNull();
  });
});

describe("motion pause store", () => {
  it("starts paused when a past visit saved it", async () => {
    window.localStorage.setItem(MOTION_PAUSE_KEY, "1");
    const { MotionToggle: Fresh } = await import(
      "../../../src/components/atmosphere/MotionToggle.js"
    );
    render(<Fresh />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("still pauses when storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { MotionToggle: Fresh } = await import(
      "../../../src/components/atmosphere/MotionToggle.js"
    );
    const user = userEvent.setup();
    render(<Fresh />);
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});
