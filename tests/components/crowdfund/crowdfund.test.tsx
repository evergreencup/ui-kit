/**
 * @file tests/components/crowdfund/crowdfund.test.tsx
 * @desc Donor amounts, DonorCard, TopDonorCallout, DonorWall's tabs, the banner sanitizer,
 *       DonorBanner and BannerPicker.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BannerPicker } from "../../../src/components/crowdfund/BannerPicker.js";
import {
  CLASSIC_BANNER_STYLE,
  type DonorBannerVariant,
  sanitizeBannerText,
} from "../../../src/components/crowdfund/bannerVariants.js";
import { DonorBanner } from "../../../src/components/crowdfund/DonorBanner.js";
import { DonorCard } from "../../../src/components/crowdfund/DonorCard.js";
import { DonorWall } from "../../../src/components/crowdfund/DonorWall.js";
import { type Donor, donorAmount } from "../../../src/components/crowdfund/donors.js";
import { TopDonorCallout } from "../../../src/components/crowdfund/TopDonorCallout.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

const CEDAR: Donor = {
  id: "1",
  name: "cedar",
  amountCents: 2500,
  osuId: 42,
  avatarUrl: "https://a.ppy.sh/42",
  message: "Go Rain City",
  recurring: true,
  date: "2026-09-14",
};
const ANON: Donor = { id: "2", name: "Anonymous", amountCents: 120000, currency: "CAD" };

const VARIANTS: DonorBannerVariant[] = [
  { id: "frost", label: "Classic", src: "/banners/a.png", ...CLASSIC_BANNER_STYLE },
  {
    id: "plain",
    label: "Plain",
    src: "/banners/b.png",
    ...CLASSIC_BANNER_STYLE,
    name: { ...CLASSIC_BANNER_STYLE.name, shadow: "" },
  },
];

describe("donors", () => {
  it("prints whole dollars with the currency", () => {
    expect(donorAmount(CEDAR)).toBe("$25 USD");
    expect(donorAmount(ANON)).toBe("$1,200 CAD");
  });
});

describe("DonorCard", () => {
  it("shows rank, avatar, linked name, recurring tag, message and date", async () => {
    const { container } = render(
      <ul>
        <DonorCard donor={CEDAR} rank={3} />
        <DonorCard donor={ANON} />
      </ul>,
    );
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "cedar" })).toHaveAttribute(
      "href",
      "https://osu.ppy.sh/users/42",
    );
    expect(screen.getByText("recurring")).toBeInTheDocument();
    expect(screen.getByText("“Go Rain City”")).toBeInTheDocument();
    expect(screen.getByText("Sep 14")).toBeInTheDocument();
    expect(screen.getByText("Anonymous").tagName).toBe("SPAN");
    expect(container.querySelectorAll("img")).toHaveLength(1);
    await expectNoAxeViolations(container);
  });
});

describe("TopDonorCallout", () => {
  it("highlights the leader", async () => {
    const { container } = render(<TopDonorCallout donor={CEDAR} />);
    expect(screen.getByText("Currently leading the wall")).toBeInTheDocument();
    expect(screen.getByText("$25 USD")).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("invites a first donor", () => {
    render(<TopDonorCallout donor={null} empty="Nobody yet" />);
    expect(screen.getByText("Nobody yet")).toBeInTheDocument();
  });
});

describe("DonorWall", () => {
  it("switches lists by click and arrow keys, ranking the top list", async () => {
    const user = userEvent.setup();
    const { container } = render(<DonorWall latest={[CEDAR, ANON]} top={[ANON, CEDAR]} />);
    expect(screen.getByRole("heading", { level: 2, name: "Donor wall" })).toBeInTheDocument();
    const [latest, top] = screen.getAllByRole("tab");
    expect(latest).toHaveAttribute("aria-selected", "true");
    expect(screen.queryByText("01")).toBeNull();
    await user.click(top as HTMLElement);
    expect(top).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Top donors");
    expect(screen.getByText("01")).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(latest).toHaveFocus();
    expect(latest).toHaveAttribute("aria-selected", "true");
    await user.keyboard("q");
    expect(latest).toHaveFocus();
    await expectNoAxeViolations(container);
  });

  it("shows the empty line", () => {
    render(<DonorWall latest={[]} top={[]} title="Supporters" empty="None" level={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Supporters" })).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
  });
});

describe("banners", () => {
  it("sanitizes names and subtitles", () => {
    expect(sanitizeBannerText("  ce\u0007dar\n ", 10)).toBe("cedar");
    expect(sanitizeBannerText("a\u007fb", 10)).toBe("ab");
    expect(sanitizeBannerText("abcdef", 3)).toBe("abc");
  });

  it("overlays the uppercased name and subtitle on the art", async () => {
    const { container } = render(
      <DonorBanner
        name="cedar"
        subtitle="Founding donor"
        variant={VARIANTS[0] as DonorBannerVariant}
        className="max-w-md"
      />,
    );
    const banner = screen.getByRole("img", { name: "Classic banner: CEDAR, Founding donor" });
    expect(banner).toHaveClass("max-w-md");
    expect(container.querySelector("img")).toHaveAttribute("src", "/banners/a.png");
    expect(screen.getByText("Founding donor")).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it("falls back to DONOR and drops an empty shadow", () => {
    render(<DonorBanner name={"\n"} variant={VARIANTS[1] as DonorBannerVariant} />);
    expect(screen.getByRole("img", { name: "Plain banner: DONOR" })).toBeInTheDocument();
    expect(screen.getByText("DONOR").style.textShadow).toBe("");
  });

  it("picks a variant", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container, rerender } = render(
      <BannerPicker variants={VARIANTS} name="cedar" value="frost" onChange={onChange} />,
    );
    expect(screen.getByRole("group", { name: "Banner style" })).toBeInTheDocument();
    const [classic, plain] = screen.getAllByRole("button");
    expect(classic).toHaveAttribute("aria-pressed", "true");
    expect(classic).toHaveTextContent("Classic · selected");
    await user.click(plain as HTMLElement);
    expect(onChange).toHaveBeenCalledWith("plain");
    await expectNoAxeViolations(container);
    rerender(
      <BannerPicker
        variants={VARIANTS}
        name="cedar"
        value="frost"
        onChange={onChange}
        disabled
        label="Look"
      />,
    );
    expect(plain).toBeDisabled();
  });
});
