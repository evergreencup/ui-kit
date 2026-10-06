/**
 * @file tests/components/brand/kit.test.tsx
 * @desc SwatchTile, PaletteGrid, TypeSpecimen, TokenRow and BrandKit.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FONTS } from "../../../src/brand/identity.js";
import { SEMANTIC_TOKENS } from "../../../src/brand/palette.js";
import { BrandKit } from "../../../src/components/brand/BrandKit.js";
import { PaletteGrid } from "../../../src/components/brand/PaletteGrid.js";
import { SwatchTile } from "../../../src/components/brand/SwatchTile.js";
import { TokenRow } from "../../../src/components/brand/TokenRow.js";
import { TypeSpecimen } from "../../../src/components/brand/TypeSpecimen.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("SwatchTile", () => {
  it("paints the color with its readable ink and captions it", () => {
    const { container } = render(<SwatchTile hex="#051a0d" token="evergreen-950" label="950" />);
    const block = container.querySelector("figure > div") as HTMLElement;
    expect(block.style.backgroundColor).toBe("rgb(5, 26, 13)");
    expect(block.style.color).toBe("rgb(237, 242, 244)");
    expect(block).toHaveClass("h-24");
    expect(screen.getByText("evergreen-950")).toBeInTheDocument();
  });

  it("shows a name and usage at the large size", () => {
    const { container } = render(
      <SwatchTile hex="#eefaf1" token="evergreen-50" label="Mist" usage="Body text" size="lg" />,
    );
    expect(container.querySelector("figure > div")).toHaveClass("h-40");
    expect(screen.getByText("Mist")).toHaveClass("font-display");
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });
});

describe("PaletteGrid, TypeSpecimen, TokenRow", () => {
  it("lists a palette's steps under its name", () => {
    render(<PaletteGrid name="moss" level={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Moss" })).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(4);
  });

  it("shows a type family and a token", () => {
    render(
      <>
        <TypeSpecimen font={FONTS[2] as (typeof FONTS)[number]} />
        <TokenRow color={SEMANTIC_TOKENS[0] as (typeof SEMANTIC_TOKENS)[number]} />
      </>,
    );
    expect(screen.getByText("Geist Mono")).toBeInTheDocument();
    expect(screen.getByText("400 · 500")).toBeInTheDocument();
    expect(screen.getByText("The page itself")).toBeInTheDocument();
  });
});

describe("BrandKit", () => {
  it("renders every section with extra children last and passes axe", async () => {
    const { container } = render(
      <BrandKit>
        <p>Contact us</p>
      </BrandKit>,
    );
    for (const id of ["core", "color", "surfaces", "type", "lockups"]) {
      expect(container.querySelector(`section#${id}`)).toBeInTheDocument();
    }
    expect(
      within(container.querySelector("#core") as HTMLElement).getAllByRole("figure"),
    ).toHaveLength(5);
    expect(container.lastChild?.lastChild).toHaveTextContent("Contact us");
    await expectNoAxeViolations(container);
  });
});
