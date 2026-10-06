/**
 * @file tests/components/data/data.test.tsx
 * @desc DataTable, Toc, ChartCard, ChartTooltip, ChartLegend and the chart theme.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartCard } from "../../../src/components/data/ChartCard.js";
import { ChartLegend, ChartTooltip } from "../../../src/components/data/ChartTooltip.js";
import {
  CURSOR,
  GRID,
  SERIES_COLORS,
  seriesColor,
} from "../../../src/components/data/chartTheme.js";
import { DataTable } from "../../../src/components/data/DataTable.js";
import { Toc } from "../../../src/components/data/Toc.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("DataTable", () => {
  it("renders a captioned table with mono numeric columns", async () => {
    const { container } = render(
      <DataTable
        caption="Star rating per round"
        columns={[{ label: "Round" }, { label: "SR", mono: true }]}
        rows={[
          ["Qualifiers", "5.6–6.0"],
          ["Finals", "6.8–7.2"],
        ]}
        className="mt-4"
      />,
    );
    const table = screen.getByRole("table", { name: "Star rating per round" });
    expect(container.querySelector("caption")).toHaveClass("sr-only");
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getByText("6.8–7.2")).toHaveClass("font-mono");
    expect(screen.getByText("Finals")).toHaveClass("text-sm");
    expect(table.parentElement).toHaveClass("mt-4");
    await expectNoAxeViolations(container);
  });

  it("shows the caption and survives a row longer than the columns", () => {
    const { container } = render(
      <DataTable caption="C" showCaption columns={[{ label: "A" }]} rows={[["x", "extra"]]} />,
    );
    expect(container.querySelector("caption")).not.toHaveClass("sr-only");
    expect(screen.getByText("extra")).toHaveClass("text-sm");
  });
});

describe("Toc", () => {
  it("links each section with its ordinal", async () => {
    const { container } = render(
      <Toc
        className="mt-2"
        entries={[
          { id: "format", num: "01", title: "Format" },
          { id: "faq", title: "FAQ" },
        ]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "On this page" });
    expect(nav).toHaveClass("lg:sticky", "mt-2");
    expect(screen.getByRole("link", { name: "01 Format" })).toHaveAttribute("href", "#format");
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "#faq");
    await expectNoAxeViolations(container);
  });

  it("takes its own landmark label and heading", () => {
    render(<Toc entries={[]} label="LAN sections" heading="Sections" />);
    expect(screen.getByRole("navigation", { name: "LAN sections" })).toHaveTextContent("Sections");
  });
});

describe("ChartCard", () => {
  it("frames a chart with its headline", async () => {
    const { container } = render(
      <ChartCard
        eyebrow="Crowdfund"
        title="Raised"
        caption="Last 30 days"
        headline="$1,250"
        headlineLabel="total"
        aspect="tall"
      >
        <svg aria-hidden />
      </ChartCard>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Raised" })).toBeInTheDocument();
    expect(screen.getByText("$1,250")).toBeInTheDocument();
    expect(screen.getByText("total")).toBeInTheDocument();
    expect(container.querySelector(".h-72 svg")).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("shows the empty message instead of the chart", () => {
    const { container } = render(
      <ChartCard eyebrow="E" title="T" empty="No donations logged yet." level={2}>
        <svg aria-hidden />
      </ChartCard>,
    );
    expect(screen.getByText("No donations logged yet.")).toBeInTheDocument();
    expect(container.querySelector(".h-60 svg")).toBeNull();
    expect(screen.queryByText("total")).toBeNull();
  });
});

describe("ChartTooltip and ChartLegend", () => {
  it("lists rows with swatches and a footer", () => {
    const { container } = render(
      <>
        <ChartTooltip
          heading="Oct 4"
          rows={[
            { label: "Raised", value: "$50", swatch: "red" },
            { label: "Count", value: "3" },
          ]}
          footer="note"
        />
        <ChartLegend
          className="mt-1"
          rows={[
            { label: "Ko-fi", value: "4", swatch: "blue" },
            { label: "Manual", value: "1" },
          ]}
        />
      </>,
    );
    expect(screen.getByText("Oct 4")).toBeInTheDocument();
    expect(screen.getByText("note")).toBeInTheDocument();
    expect(container.querySelectorAll("[aria-hidden]")).toHaveLength(2);
    expect(screen.getByText(/Manual · 1/)).toBeInTheDocument();
    render(<ChartTooltip heading="h" rows={[]} />);
  });
});

describe("chartTheme", () => {
  it("cycles series colors, negatives too", () => {
    expect(seriesColor(0)).toBe(SERIES_COLORS[0]);
    expect(seriesColor(SERIES_COLORS.length + 1)).toBe(SERIES_COLORS[1]);
    expect(seriesColor(-1)).toBe(SERIES_COLORS.at(-1));
    expect(GRID.strokeOpacity).toBe(0.35);
    expect(CURSOR.line.strokeDasharray).toBe("3 3");
  });
});
