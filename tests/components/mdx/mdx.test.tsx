/**
 * @file tests/components/mdx/mdx.test.tsx
 * @desc The MDX element map: anchored headings, prose, lists, rules, links.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";
import { mdxComponents } from "../../../src/components/mdx/mdxComponents.js";
import { expectNoAxeViolations } from "../../helpers/axe.js";

const C = mdxComponents as Record<string, ComponentType<Record<string, unknown>>>;
const el = (name: string, props: Record<string, unknown> = {}) => {
  const Tag = C[name] as ComponentType<Record<string, unknown>>;
  return <Tag {...props} />;
};

describe("mdxComponents", () => {
  it("renders a legal page's elements with anchors", async () => {
    const { container } = render(
      <article>
        {el("h1", { children: "Privacy" })}
        {el("h2", { children: "Photography & recording" })}
        {el("h3", { children: "Who sees it" })}
        {el("h2", { children: ["Mixed ", <em key="e">content</em>] })}
        {el("p", { children: "Body" })}
        {el("ul", { children: el("li", { children: "one" }) })}
        {el("ol", { children: el("li", { children: "two" }) })}
        {el("strong", { children: "Bold" })}
        {el("hr")}
        {el("a", { href: "/legal/terms", children: "Terms" })}
        {el("a", { href: "https://ppy.sh", children: "ppy" })}
        {el("a", { children: "No href" })}
      </article>,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Photography & recording" }),
    ).toHaveAttribute("id", "photography-and-recording");
    expect(screen.getByRole("heading", { level: 3 })).toHaveAttribute("id", "who-sees-it");
    expect(screen.getByRole("heading", { level: 2, name: "Mixed content" })).not.toHaveAttribute(
      "id",
    );
    expect(screen.getByRole("link", { name: "Terms" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "ppy" })).toHaveAttribute("target", "_blank");
    expect(container.querySelector("ul")).toHaveClass("list-disc");
    expect(container.querySelector("ol")).toHaveClass("list-decimal");
    expect(container.querySelector("hr")).toBeInTheDocument();
    expect(screen.getByText("No href")).toHaveAttribute("href", "");
    await expectNoAxeViolations(container);
  });
});
