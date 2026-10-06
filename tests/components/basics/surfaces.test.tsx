/**
 * @file tests/components/basics/surfaces.test.tsx
 * @desc Panel, panelClasses, Container, Eyebrow, DisplayHeading, Section, Notice, Badge,
 *       Highlight: elements, tones and layout.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../../../src/components/basics/Badge.js";
import { Container } from "../../../src/components/basics/Container.js";
import { DisplayHeading } from "../../../src/components/basics/DisplayHeading.js";
import { Eyebrow } from "../../../src/components/basics/Eyebrow.js";
import { Highlight } from "../../../src/components/basics/Highlight.js";
import { headingClasses } from "../../../src/components/basics/headingStyles.js";
import { labelClasses } from "../../../src/components/basics/labelStyles.js";
import { Notice } from "../../../src/components/basics/Notice.js";
import { Panel } from "../../../src/components/basics/Panel.js";
import { panelClasses } from "../../../src/components/basics/panelStyles.js";
import { Section } from "../../../src/components/basics/Section.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("Panel", () => {
  it("renders a div by default and the element asked for", () => {
    const { container, rerender } = render(<Panel data-testid="p">x</Panel>);
    expect(screen.getByTestId("p").tagName).toBe("DIV");
    expect(screen.getByTestId("p")).toHaveClass(
      "rounded-sm",
      "border",
      "p-5",
      "bg-evergreen-950/40",
    );
    rerender(
      <Panel as="article" tone="striped" padding="none" interactive data-testid="p">
        x
      </Panel>,
    );
    const a = screen.getByTestId("p");
    expect(a.tagName).toBe("ARTICLE");
    expect(a).toHaveClass("diag-stripes", "hover:border-evergreen-600/60");
    expect(container.firstChild).toBe(a);
  });

  it("builds every tone and padding", () => {
    expect(panelClasses({ tone: "solid" })).toContain("bg-evergreen-950");
    expect(panelClasses({ tone: "raised" })).toContain("bg-evergreen-900/40");
    expect(panelClasses({ tone: "active" })).toContain("border-evergreen-500/60");
    expect(panelClasses({ padding: "sm" })).toContain("p-3");
    expect(panelClasses({ padding: "md" })).toContain("p-4");
    expect(panelClasses({ padding: "xl" })).toContain("sm:p-8");
    expect(panelClasses({ padding: "lg", className: "p-2" })).toContain("p-2");
  });
});

describe("Container", () => {
  it("centers a page-width column with gutters, or the width and element asked for", () => {
    const { rerender } = render(<Container data-testid="c" />);
    expect(screen.getByTestId("c")).toHaveClass("mx-auto", "max-w-5xl", "px-4", "lg:px-8");
    rerender(<Container as="main" width="full" data-testid="c" />);
    expect(screen.getByTestId("c").tagName).toBe("MAIN");
    expect(screen.getByTestId("c")).toHaveClass("max-w-7xl");
  });
});

describe("Eyebrow and labelClasses", () => {
  it("renders a moss label by default, or a p in the tone and size given", () => {
    const { rerender } = render(<Eyebrow>Goal</Eyebrow>);
    expect(screen.getByText("Goal").tagName).toBe("SPAN");
    expect(screen.getByText("Goal")).toHaveClass(
      "font-mono",
      "uppercase",
      "text-moss-400",
      "text-[10px]",
    );
    rerender(
      <Eyebrow as="p" tone="cascade" size="md">
        Goal
      </Eyebrow>,
    );
    expect(screen.getByText("Goal").tagName).toBe("P");
    expect(screen.getByText("Goal")).toHaveClass("text-cascade-300", "text-[11px]");
    expect(labelClasses({ size: "xs", tone: "bark" })).toContain("text-[9px]");
  });
});

describe("DisplayHeading", () => {
  it("renders the level with the size's classes", () => {
    render(
      <DisplayHeading level={1} size="hero">
        Evergreen
      </DisplayHeading>,
    );
    const h = screen.getByRole("heading", { level: 1 });
    expect(h).toHaveClass("font-display", "text-evergreen-50", "md:text-7xl");
    expect(headingClasses()).toContain("text-2xl");
    expect(headingClasses("xl")).toContain("sm:text-4xl");
    expect(headingClasses("md")).toContain("text-xl");
    expect(headingClasses("sm", "mt-2")).toContain("mt-2");
  });
});

describe("Section", () => {
  it("anchors itself, links its ordinal and shows a lead under a rule", async () => {
    const { container } = render(
      <Section id="format" num="01" title="Format" lead="How it works">
        <p>Body</p>
      </Section>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "format");
    expect(screen.getByRole("link", { name: "Section 01" })).toHaveAttribute("href", "#format");
    expect(screen.getByRole("heading", { level: 2, name: "Format" })).toBeInTheDocument();
    expect(screen.getByText("How it works")).toBeInTheDocument();
    expect(container.querySelector("header")).toHaveClass("border-b");
    await expectNoAxeViolations(container);
  });

  it("drops the ordinal, lead and rule when asked", () => {
    const { container } = render(
      <Section id="x" title="Plain" level={3} rule={false}>
        Body
      </Section>,
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    expect(container.querySelector("header")).not.toHaveClass("border-b");
  });
});

describe("Notice", () => {
  it("shows a striped note with a default and a custom title", async () => {
    const { container, rerender } = render(<Notice>Locked before qualifiers.</Notice>);
    expect(container.querySelector("aside")).toHaveClass("diag-stripes", "flex");
    expect(screen.getByText("Pending")).toHaveClass("text-cascade-300");
    rerender(
      <Notice title="In the workshop" tone="evergreen" className="mt-4">
        Soon.
      </Notice>,
    );
    expect(screen.getByText("In the workshop")).toHaveClass("text-evergreen-300");
    expect(container.querySelector("aside")).toHaveClass("mt-4");
    await expectNoAxeViolations(container);
  });
});

describe("Badge and Highlight", () => {
  it("tones a badge and rounds it on request", () => {
    const { rerender } = render(<Badge>new</Badge>);
    expect(screen.getByText("new")).toHaveClass("rounded-sm", "text-fog-200");
    rerender(
      <Badge tone="success" pill>
        new
      </Badge>,
    );
    expect(screen.getByText("new")).toHaveClass("rounded-full", "text-evergreen-100");
  });

  it("highlights in bark as strong text", () => {
    render(<Highlight className="text-sm">Signups close Oct 4</Highlight>);
    const s = screen.getByText("Signups close Oct 4");
    expect(s.tagName).toBe("STRONG");
    expect(s).toHaveClass("bg-bark-500/25", "text-sm");
  });
});
