/**
 * @file tests/hooks/hooks.test.tsx
 * @desc useMediaQuery, useMotionEnabled, useMounted, useEscapeKey, useOutsideClick and the
 *       counted useScrollLock.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { act, fireEvent, render, renderHook } from "@testing-library/react";
import { useRef } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  useEscapeKey,
  useFocusTrap,
  useOutsideClick,
  useScrollLock,
} from "../../src/hooks/useDismiss.js";
import { useMediaQuery, useMotionEnabled } from "../../src/hooks/useMediaQuery.js";
import { useMounted } from "../../src/hooks/useMounted.js";
import { listenerCount, REDUCE, setMedia } from "../helpers/media.js";

describe("useMediaQuery", () => {
  it("reads the query and re-renders when it flips, then unsubscribes", () => {
    const { result, unmount } = renderHook(() => useMediaQuery("(pointer: coarse)"));
    expect(result.current).toBe(false);
    act(() => setMedia("(pointer: coarse)", true));
    expect(result.current).toBe(true);
    unmount();
    expect(listenerCount("(pointer: coarse)")).toBe(0);
  });

  it("reports the server value during SSR", () => {
    const Probe = () => <span>{String(useMediaQuery("(x)", true))}</span>;
    expect(renderToString(<Probe />)).toContain("true");
  });
});

describe("useMotionEnabled", () => {
  it("is false under reduced motion and on the server, true otherwise", () => {
    const Probe = () => <span>{String(useMotionEnabled())}</span>;
    expect(renderToString(<Probe />)).toContain("false");
    const { result } = renderHook(() => useMotionEnabled());
    expect(result.current).toBe(true);
    act(() => setMedia(REDUCE, true));
    expect(result.current).toBe(false);
  });
});

describe("useMounted", () => {
  it("is false on the server and true on the client", () => {
    const Probe = () => <span>{String(useMounted())}</span>;
    expect(renderToString(<Probe />)).toContain("false");
    expect(renderHook(() => useMounted()).result.current).toBe(true);
  });
});

describe("useEscapeKey", () => {
  it("calls back on Escape only while active", () => {
    const onEscape = vi.fn();
    const { rerender, unmount } = renderHook(({ on }) => useEscapeKey(on, onEscape), {
      initialProps: { on: false },
    });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onEscape).not.toHaveBeenCalled();
    rerender({ on: true });
    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onEscape).toHaveBeenCalledTimes(1);
    unmount();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });
});

describe("useOutsideClick", () => {
  it("fires for a mousedown outside the element, not inside, only while active", () => {
    const onOutside = vi.fn();
    const Box = ({ on }: { on: boolean }) => {
      const ref = useRef<HTMLDivElement | null>(null);
      useOutsideClick(ref, on, onOutside);
      return (
        <div>
          <div ref={ref} data-testid="in" />
          <div data-testid="out" />
        </div>
      );
    };
    const { getByTestId, rerender, unmount } = render(<Box on={false} />);
    fireEvent.mouseDown(getByTestId("out"));
    expect(onOutside).not.toHaveBeenCalled();
    rerender(<Box on />);
    fireEvent.mouseDown(getByTestId("in"));
    fireEvent.mouseDown(getByTestId("out"));
    expect(onOutside).toHaveBeenCalledTimes(1);
    unmount();
    fireEvent.mouseDown(document.body);
    expect(onOutside).toHaveBeenCalledTimes(1);
  });
});

describe("useScrollLock", () => {
  it("locks while any holder is active and restores the page's own overflow", () => {
    document.body.style.overflow = "scroll";
    const a = renderHook(({ on }) => useScrollLock(on), { initialProps: { on: true } });
    const b = renderHook(() => useScrollLock(true));
    renderHook(() => useScrollLock(false));
    expect(document.body.style.overflow).toBe("hidden");
    a.rerender({ on: false });
    expect(document.body.style.overflow).toBe("hidden");
    b.unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });
});

describe("useFocusTrap", () => {
  it("does nothing while inactive or before its element mounts", () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();
    const { rerender, unmount } = renderHook(({ on }) => useFocusTrap({ current: null }, on), {
      initialProps: { on: false },
    });
    rerender({ on: true });
    fireEvent.keyDown(document, { key: "Tab" });
    expect(outside).toHaveFocus();
    unmount();
    expect(outside).toHaveFocus();
    outside.remove();
  });
});
