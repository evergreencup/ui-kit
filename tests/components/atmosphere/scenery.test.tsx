/**
 * @file tests/components/atmosphere/scenery.test.tsx
 * @desc Sky, MountRainier, SeattleSkyline, MistBand, TreeLine and the tree geometry.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MistBand } from "../../../src/components/atmosphere/MistBand.js";
import { MountRainier } from "../../../src/components/atmosphere/MountRainier.js";
import { parallaxStyle } from "../../../src/components/atmosphere/parallax.js";
import { SeattleSkyline } from "../../../src/components/atmosphere/SeattleSkyline.js";
import { Sky } from "../../../src/components/atmosphere/Sky.js";
import { TreeLine } from "../../../src/components/atmosphere/TreeLine.js";
import { coniferPoints, GROUND_Y, treeRow } from "../../../src/components/atmosphere/trees.js";

const factor = (el: Element | null) =>
  (el as HTMLElement).style.getPropertyValue("--parallax-factor");

describe("parallaxStyle", () => {
  it("sets the factor and keeps other styles", () => {
    expect(parallaxStyle(4, { opacity: 0.5 })).toEqual({ "--parallax-factor": 4, opacity: 0.5 });
    expect(parallaxStyle(2)).toEqual({ "--parallax-factor": 2 });
  });
});

describe("Sky", () => {
  it("draws seeded stars and the gradient, the same every render", () => {
    const a = render(<Sky stars={5} />).container.innerHTML;
    const b = render(<Sky stars={5} />).container.innerHTML;
    expect(a).toBe(b);
    const { container } = render(<Sky stars={7} seed={1} depth={9} tintTop="red" tintMid="blue" />);
    expect(container.querySelectorAll("[data-star]")).toHaveLength(7);
    expect(factor(container.firstElementChild)).toBe("9");
    expect(container.innerHTML).toContain("red");
  });
});

describe("MountRainier and SeattleSkyline", () => {
  it("offsets and scales the mountain with unique gradient ids", () => {
    const { container } = render(
      <>
        <MountRainier offsetX={0.5} scale={1.2} />
        <MountRainier />
      </>,
    );
    const [one, two] = container.querySelectorAll(":scope > div") as unknown as HTMLElement[];
    expect(one?.style.transform).toBe("translate3d(4%, 0, 0) scale(1.2)");
    const ids = [...container.querySelectorAll("linearGradient")].map((g) => g.id);
    expect(new Set(ids).size).toBe(4);
    expect(two?.querySelector("path")?.getAttribute("fill")).toMatch(/^url\(#.+-fill\)$/);
  });

  it("draws the skyline at its alpha and offset", () => {
    const { container } = render(<SeattleSkyline offsetX={-1} opacity={0.5} depth={3} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.opacity).toBe("0.5");
    expect(el.style.transform).toBe("translate3d(-10%, 0, 0)");
    expect(container.querySelectorAll("polygon")).toHaveLength(3);
    expect(container.querySelector("ellipse")).toBeInTheDocument();
    expect(render(<SeattleSkyline />).container.firstElementChild).toHaveStyle({ opacity: "0.28" });
  });
});

describe("MistBand", () => {
  it("drifts by default and holds still on request", () => {
    const { container, rerender } = render(<MistBand top="30%" height="10%" />);
    expect(container.querySelector(".mist-drift")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveStyle({ top: "30%", height: "10%", opacity: "0.15" });
    rerender(<MistBand top="30%" height="10%" animate={false} tint="red" />);
    expect(container.querySelector(".mist-drift")).toBeNull();
    expect(container.innerHTML).toContain("red");
  });
});

describe("trees", () => {
  it("keeps the base row at density 1, thins below and fills above", () => {
    expect(treeRow("far", 1, 1)).toHaveLength(9);
    expect(treeRow("near", 1, 1)).toHaveLength(8);
    expect(treeRow("far", 0.3, 419).length).toBeLessThan(9);
    expect(treeRow("near", 1.5, 731)).toHaveLength(12);
    expect(treeRow("near", 1.5, 731)).toEqual(treeRow("near", 1.5, 731));
  });

  it("alternates sway and formats timing", () => {
    const [a, b] = treeRow("far", 1, 5);
    expect(a?.sway).toBe("sway-left");
    expect(b?.sway).toBe("sway-right");
    expect(a?.duration).toMatch(/^\d\.\d{2}s$/);
  });

  it("builds an 11-point conifer standing on the ground", () => {
    const pts = coniferPoints({ x: 100, h: 200, w: 100 }).split(" ");
    expect(pts).toHaveLength(11);
    expect(pts[0]).toBe(`100,${(GROUND_Y - 200).toString()}`);
    expect(pts[5]).toBe(`150,${GROUND_Y.toString()}`);
  });
});

describe("TreeLine", () => {
  it("draws each tree with its sway and the row's default depth", () => {
    const { container, rerender } = render(<TreeLine layer="far" />);
    expect(container.querySelectorAll("polygon")).toHaveLength(9);
    expect(factor(container.firstElementChild)).toBe("10");
    expect(container.querySelector("polygon")).toHaveClass("sway-left");
    rerender(<TreeLine layer="near" density={0.5} seed={3} depth={4} />);
    expect(factor(container.firstElementChild)).toBe("4");
    expect(container.querySelectorAll("stop")[0]).toHaveAttribute("stop-color", "#104726");
    rerender(<TreeLine layer="near" />);
    expect(factor(container.firstElementChild)).toBe("18");
  });
});
