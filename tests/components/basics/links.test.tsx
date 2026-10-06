/**
 * @file tests/components/basics/links.test.tsx
 * @desc AutoLink and TextLink: internal vs external, new tabs, rel, the arrow.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AutoLink } from "../../../src/components/basics/AutoLink.js";
import { TextLink } from "../../../src/components/basics/TextLink.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

describe("AutoLink", () => {
  it("routes an internal path in the same tab", () => {
    render(<AutoLink href="/rules">Rules</AutoLink>);
    const a = screen.getByRole("link");
    expect(a).toHaveAttribute("href", "/rules");
    expect(a).not.toHaveAttribute("target");
  });

  it("opens an external URL in a new tab with noreferrer", () => {
    render(<AutoLink href="https://ko-fi.com/egc26">Ko-fi</AutoLink>);
    const a = screen.getByRole("link");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noreferrer");
  });

  it("honors newTab and a caller rel either way", () => {
    render(
      <>
        <AutoLink href="https://x.test" newTab={false}>
          Same
        </AutoLink>
        <AutoLink href="/doc" newTab rel="noopener">
          New
        </AutoLink>
      </>,
    );
    expect(screen.getByRole("link", { name: "Same" })).not.toHaveAttribute("target");
    const n = screen.getByRole("link", { name: "New" });
    expect(n).toHaveAttribute("target", "_blank");
    expect(n).toHaveAttribute("rel", "noopener");
  });
});

describe("TextLink", () => {
  it("underlines inline links and adds the arrow only for external ones", async () => {
    const { container } = render(
      <p>
        <TextLink href="https://x.test" arrow>
          Out
        </TextLink>{" "}
        <TextLink href="/in" arrow variant="quiet" className="text-xs">
          In
        </TextLink>
      </p>,
    );
    const out = screen.getByRole("link", { name: /Out/ });
    expect(out).toHaveClass("underline");
    expect(out).toHaveTextContent("Out ↗");
    const inner = screen.getByRole("link", { name: "In" });
    expect(inner).not.toHaveClass("underline");
    expect(inner).toHaveClass("text-xs");
    await expectNoAxeViolations(container);
  });
});
