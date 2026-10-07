/**
 * @file tests/components/atmosphere/motion.test.tsx
 * @desc MapleLeafDrift, ParallaxScope and HeroVideo.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroVideo } from "../../../src/components/atmosphere/HeroVideo.js";
import { MapleLeafDrift } from "../../../src/components/atmosphere/MapleLeafDrift.js";
import { PARALLAX_EASE, ParallaxScope } from "../../../src/components/atmosphere/ParallaxScope.js";
import { manualFrames } from "../../helpers/frames.js";
import { REDUCE, setMedia } from "../../helpers/media.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MapleLeafDrift", () => {
  it("drifts a leaf with its delay, or hides under reduced motion", () => {
    const { container, rerender } = render(<MapleLeafDrift className="top-0 left-0" delay="3s" />);
    expect(container.firstElementChild).toHaveClass("top-0", "left-0");
    expect(
      (container.querySelector("svg") as unknown as HTMLElement).style.getPropertyValue(
        "--leaf-delay",
      ),
    ).toBe("3s");
    act(() => setMedia(REDUCE, true));
    rerender(<MapleLeafDrift />);
    expect(container.firstChild).toBeNull();
  });
});

describe("ParallaxScope", () => {
  const setup = (strength?: number) => {
    const frames = manualFrames();
    const view = render(
      <ParallaxScope className="absolute" {...(strength ? { strength } : {})}>
        <span />
      </ParallaxScope>,
    );
    const node = view.container.firstElementChild as HTMLElement;
    node.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
    return { ...view, frames, node };
  };

  it("eases --px/--py toward the pointer and back to center on leave", () => {
    const { frames, node, unmount } = setup(2);
    fireEvent.mouseMove(window, { clientX: 200, clientY: 100 });
    frames.step(0);
    expect(node.style.getPropertyValue("--px")).toBe((2 * PARALLAX_EASE).toFixed(3));
    expect(node.style.getPropertyValue("--py")).toBe((2 * PARALLAX_EASE).toFixed(3));
    fireEvent.mouseLeave(document.documentElement);
    frames.step(16);
    expect(Number(node.style.getPropertyValue("--px"))).toBeLessThan(2 * PARALLAX_EASE);
    unmount();
    expect(frames.pending()).toBe(0);
  });

  it("handles a zero-size box and stays off for reduced motion or touch", () => {
    const { frames, node } = setup();
    node.getBoundingClientRect = () => ({ left: 0, top: 0, width: 0, height: 0 }) as DOMRect;
    fireEvent.mouseMove(window, { clientX: 5, clientY: 5 });
    frames.step(0);
    expect(node.style.getPropertyValue("--px")).toBe((5 * PARALLAX_EASE).toFixed(3));
    vi.restoreAllMocks();
    setMedia("(pointer: coarse)", true);
    const off = manualFrames();
    render(
      <ParallaxScope>
        <span />
      </ParallaxScope>,
    );
    expect(off.pending()).toBe(0);
  });
});

describe("HeroVideo", () => {
  it("plays the clip over the poster with overlays and a scrim, fading in once ready", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const { container } = render(
      <HeroVideo
        poster="/p.jpg"
        webm="/v.webm"
        mp4="/v.mp4"
        rain="light"
        snow="heavy"
        objectPosition="center 30%"
      />,
    );
    expect(container.querySelector("img")).toHaveAttribute("src", "/p.jpg");
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video).toHaveClass("opacity-0");
    expect(container.querySelectorAll("source")).toHaveLength(2);
    expect(play).toHaveBeenCalled();
    fireEvent.canPlay(video);
    expect(video).toHaveClass("opacity-100");
    expect(container.querySelectorAll("canvas")).toHaveLength(2);
    expect(container.firstElementChild).toHaveClass("-z-10");
    expect(container.querySelectorAll(".bg-gradient-to-t")).toHaveLength(1);
  });

  it("shows only the poster without a clip, under reduced motion, and when autoplay is refused", () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(new Error("blocked"));
    const { container, rerender } = render(
      <HeroVideo poster="/p.jpg" mp4="/v.mp4" scrim={false} className="z-0" />,
    );
    expect(container.querySelectorAll("source")).toHaveLength(1);
    expect(container.querySelector(".bg-gradient-to-t")).toBeNull();
    rerender(<HeroVideo poster="/p.jpg" webm="/v.webm" />);
    expect(container.querySelector('source[type="video/webm"]')).toBeInTheDocument();
    expect(container.querySelector('source[type="video/mp4"]')).toBeNull();
    rerender(<HeroVideo poster="/p.jpg" />);
    expect(container.querySelector("video")).toBeNull();
    act(() => setMedia(REDUCE, true));
    rerender(<HeroVideo poster="/p.jpg" webm="/v.webm" />);
    expect(container.querySelector("video")).toBeNull();
  });
});
