/**
 * @file tests/charts/charts.test.tsx
 * @desc The charts subpath: sizing, the y-axis top, each tooltip with and without a hovered
 *       point, and each chart rendering its SVG (jsdom never measures, so the charts get an
 *       initial size) or its empty line.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { CumulativeRaisedChart, raisedDomainMax } from "../../src/charts/CumulativeRaisedChart.js";
import {
  type CumulativeRaisedPoint,
  CumulativeRaisedTooltip,
  RAISED_COLORS,
} from "../../src/charts/CumulativeRaisedTooltip.js";
import { DonationSourceDonut } from "../../src/charts/DonationSourceDonut.js";
import { DonationSourceTooltip } from "../../src/charts/DonationSourceTooltip.js";
import { RegistrationStatusChart } from "../../src/charts/RegistrationStatusChart.js";
import { RegistrationStatusTooltip } from "../../src/charts/RegistrationStatusTooltip.js";
import { sizeProps } from "../../src/charts/size.js";
import { activePoint } from "../../src/charts/tooltipPayload.js";
import { seriesColor } from "../../src/components/data/chartTheme.js";
import { expectNoAxeViolations } from "../helpers/axe.js";

const DAYS: CumulativeRaisedPoint[] = [
  { day: "2026-09-01", usdCents: 5000, cumulativeUsdCents: 5000, count: 2 },
  { day: "2026-09-02", usdCents: 20000, cumulativeUsdCents: 25000, count: 3 },
];

const ROWS = [
  { kind: "player", approved: 10, pending: 4, waitlisted: 2, rejected: 1, withdrawn: 0 },
  { kind: "staff", approved: 5, pending: 1, waitlisted: 0, rejected: 0, withdrawn: 1 },
];

const ZERO = { approved: 0, pending: 0, waitlisted: 0, rejected: 0, withdrawn: 0 };

describe("chart helpers", () => {
  it("sizes only with both dimensions", () => {
    expect(sizeProps({ width: 400, height: 200 })).toEqual({
      initialDimension: { width: 400, height: 200 },
    });
    expect(sizeProps({ width: 400 })).toEqual({});
  });

  it("tops the y-axis 10% over the total or the goal", () => {
    expect(raisedDomainMax(DAYS)).toBe(275);
    expect(raisedDomainMax(DAYS, 100000)).toBe(1100);
    expect(raisedDomainMax([])).toBe(2);
  });

  it("finds the hovered point", () => {
    expect(activePoint({ active: true, payload: [{ payload: 1 }] })).toBe(1);
    expect(activePoint({ active: false, payload: [{ payload: 1 }] })).toBeNull();
    expect(activePoint({ active: true })).toBeNull();
    expect(activePoint({ active: true, payload: [{}] })).toBeNull();
  });
});

describe("tooltips", () => {
  it("shows a raised day", async () => {
    const { container } = render(
      <CumulativeRaisedTooltip active payload={[{ payload: DAYS[1] }]} />,
    );
    expect(screen.getByText("Sep 2")).toBeInTheDocument();
    expect(screen.getByText("$200")).toBeInTheDocument();
    expect(screen.getByText("$250")).toBeInTheDocument();
    await expectNoAxeViolations(container);
    expect(RAISED_COLORS.daily).toMatch(/moss/);
  });

  it("shows a source slice", () => {
    render(
      <DonationSourceTooltip
        active
        payload={[
          { payload: { label: "Ko-fi", usdCents: 9900, count: 4, fill: "red", value: 9900 } },
        ]}
      />,
    );
    expect(screen.getByText("Ko-fi")).toBeInTheDocument();
    expect(screen.getByText("$99")).toBeInTheDocument();
  });

  it("shows a kind's non-zero statuses", () => {
    render(
      <RegistrationStatusTooltip
        active
        label="player"
        payload={[
          { name: "Approved", value: 10, color: "green" },
          { name: "Rejected", value: 0 },
          { name: "Odd", value: "x" },
        ]}
      />,
    );
    expect(screen.getByText("Player")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.queryByText("Rejected")).toBeNull();
    expect(screen.queryByText("Odd")).toBeNull();
  });

  it("renders nothing while idle", () => {
    const { container } = render(
      <>
        <CumulativeRaisedTooltip />
        <DonationSourceTooltip active={false} />
        <RegistrationStatusTooltip active />
        <RegistrationStatusTooltip />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("names an unlabeled kind blank", () => {
    render(<RegistrationStatusTooltip active payload={[{ name: "Approved", value: 1 }]} />);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });
});

describe("charts", () => {
  // jsdom has no layout: give every element a box so ResponsiveContainer measures a size.
  beforeAll(() => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 480,
      height: 240,
      top: 0,
      left: 0,
      right: 480,
      bottom: 240,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("draws the cumulative raised chart", async () => {
    const { container } = render(
      <CumulativeRaisedChart data={DAYS} goalUsdCents={50000} width={480} height={240} />,
    );
    expect(container.querySelector("svg.recharts-surface")).not.toBeNull();
    expect(container.querySelector("linearGradient")?.id).toMatch(/^egc-raised-[\w-]+$/);
    const table = screen.getByRole("table", { name: "Raised by day" });
    expect(table.parentElement).toHaveClass("sr-only");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((c) => c.textContent),
    ).toEqual(["Day", "Raised that day", "Raised to date"]);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(DAYS.length);
    await expectNoAxeViolations(container);
  });

  it("draws the cumulative chart without a goal or a size", () => {
    const { container } = render(
      <div style={{ width: 480, height: 240 }}>
        <CumulativeRaisedChart data={DAYS} caption="Crowdfund by day" />
      </div>,
    );
    expect(screen.getByRole("table", { name: "Crowdfund by day" })).toBeInTheDocument();
    expect(container.querySelector(".recharts-responsive-container")).not.toBeNull();
  });

  it("draws the donut with its total and legend, colors defaulting to the series", async () => {
    const { container } = render(
      <DonationSourceDonut
        width={300}
        height={300}
        slices={[
          { label: "Ko-fi", usdCents: 90000, count: 30 },
          { label: "Manual", usdCents: 34000, count: 8, color: "var(--color-bark-400)" },
        ]}
      />,
    );
    expect(screen.getByText("Raised")).toBeInTheDocument();
    expect(screen.getByText("$1,240")).toBeInTheDocument();
    expect(screen.getByText("Ko-fi · 30")).toBeInTheDocument();
    const swatch = screen.getByText("Ko-fi · 30").querySelector("span");
    expect(swatch).toHaveStyle({ backgroundColor: seriesColor(0) });
    expect(container.querySelector("svg.recharts-surface")).not.toBeNull();
    const table = screen.getByRole("table", { name: "Donations by source" });
    expect(within(table).getByRole("rowheader", { name: "Ko-fi" }).parentElement).toHaveTextContent(
      "Ko-fi30$900",
    );
    await expectNoAxeViolations(container);
  });

  it("shows the donut's empty line", () => {
    render(<DonationSourceDonut slices={[]} empty="Nothing yet" />);
    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
  });

  it("draws the registration bars", async () => {
    const { container } = render(
      <RegistrationStatusChart rows={ROWS} width={480} height={200} caption="Signups" />,
    );
    expect(container.querySelector("svg.recharts-surface")).not.toBeNull();
    const table = screen.getByRole("table", { name: "Signups" });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(6);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(ROWS.length);
    await expectNoAxeViolations(container);
  });

  it("shows the registration chart's empty line", () => {
    render(<RegistrationStatusChart rows={[{ kind: "player", ...ZERO }]} />);
    expect(screen.getByText("No registrations yet.")).toBeInTheDocument();
  });
});
