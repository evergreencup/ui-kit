/**
 * @file src/components/mdx/mdxComponents.tsx
 * @desc The MDX element map for long-form pages (legal, rules, disclaimers): display headings
 *       with anchor ids from plain-text h2/h3, fog body copy capped at 65ch, evergreen strong,
 *       hairline rules and underlined links through TextLink. Server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { slugify } from "../../utils/slug.js";
import { headingClasses } from "../basics/headingStyles.js";
import { TextLink } from "../basics/TextLink.js";

type Children = { children?: ReactNode };

const BODY = "max-w-[65ch] text-fog-300 text-sm leading-relaxed sm:text-base";
const LIST = `${BODY} mt-4 flex flex-col gap-2 pl-5`;

const idOf = (children: ReactNode): string | undefined =>
  typeof children === "string" ? slugify(children) : undefined;

/** The element overrides. Spread into an app's own `useMDXComponents`. */
export const mdxComponents: MDXComponents = {
  h1: ({ children }: Children) => (
    <h1 className={headingClasses("xl", "font-black")}>{children}</h1>
  ),
  h2: ({ children }: Children) => (
    <h2 id={idOf(children)} className={headingClasses("md", "mt-10 scroll-mt-24 text-2xl")}>
      {children}
    </h2>
  ),
  h3: ({ children }: Children) => (
    <h3 id={idOf(children)} className="mt-6 scroll-mt-24 font-semibold text-fog-100 text-lg">
      {children}
    </h3>
  ),
  p: ({ children }: Children) => <p className={`${BODY} mt-4`}>{children}</p>,
  ul: ({ children }: Children) => <ul className={`${LIST} list-disc`}>{children}</ul>,
  ol: ({ children }: Children) => <ol className={`${LIST} list-decimal`}>{children}</ol>,
  li: ({ children }: Children) => <li className="pl-1">{children}</li>,
  strong: ({ children }: Children) => (
    <strong className="font-semibold text-evergreen-100">{children}</strong>
  ),
  hr: () => <hr className="my-10 border-evergreen-800/60" />,
  a: ({ href = "", children, ...props }: ComponentProps<"a">) => (
    <TextLink href={href} {...props}>
      {children}
    </TextLink>
  ),
};
