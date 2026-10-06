# AGENTS.md

`@evergreencup/ui-kit`: the Evergreen Cup brand and React components for Next.js 16, React 19 and Tailwind 4.1+ (peer dependencies). `tsc` compiles `src/` to `dist/` one file at a time; `src/theme.css` ships as `dist/theme.css`. The README is the user documentation: keep it in step with the code. The kit is distilled from `evergreencup.org/apps/web/src/components`; that repo is reference only, never edit it from here.

## Layout

- `src/index.ts`: the barrel (`export *` per public file, grouped). `src/mdx.ts` and `src/site.ts` are the `./mdx` and `./site` subpaths.
- `src/theme.css`: the palette, semantic tokens, `font-display`, the atmosphere utilities and keyframes, `active-underline`, `parallax-layer`, `diag-stripes`, the `coarse:` variant, the one reduced-motion rule, the page background, and `@source "./"`.
- `src/brand/`: brand data, no React. `palette.ts` is the single source of every hex (theme.css mirrors it; `tests/theme.test.ts` keeps them equal), `identity.ts` (names, regions, fonts), `glyphs.ts` (marks as data, favicon and sprig builders), `colorMath.ts`, `brandText.ts`.
- `src/utils/`: `cx` (tailwind-merge), `format`, `href`, `random` (mulberry32, so seeded layers render the same on server and client), `slug`.
- `src/hooks/`: client hooks: `useMediaQuery`/`useMotionEnabled`, `useMounted`, `useDismiss` (`useEscapeKey`, `useOutsideClick`, counted `useScrollLock`).
- `src/components/<group>/`: one component per file. Groups: `basics`, `brand`, `atmosphere`, `forms`, `layout`, `icons`, `data`, `osu`, `tournament`, `mdx`.
- `*Styles.ts` files hold the class builders and constants components share: `buttonStyles` (`buttonClasses`), `panelStyles` (`panelClasses`, `HAIRLINE`, `DIVIDER`), `labelStyles` (`labelClasses`), `headingStyles` (`headingClasses`), `chipStyles` (`chipClasses`), `badgeStyles` (`STATUS_TONE_CLASSES`), `linkStyles`, `focusStyles` (`FOCUS_RING`), `forms/fieldStyles`, `forms/chipGroupStyles` (`PICKER_GRID`, `toggleValue`), `tournament/gridStyles`.
- Pure logic lives beside its component and is tested directly: `atmosphere/trees.ts`, `atmosphere/particles.ts` (engines), `atmosphere/presets.ts` (scenes as overrides of one default), `forms/selectKeys.ts`, `tournament/availability.ts`, `osu/osuLinks.ts`, `osu/modColors.ts`, `layout/nav.ts`.
- `src/site/egc.ts`: evergreencup.org's nav, CTA, account links, footer columns, socials and URLs.
- `tests/`: mirrors `src/`. `tests/setup/dom.ts` installs a controllable `matchMedia` (`tests/helpers/media.ts`), `ResizeObserver`, a recording canvas context (`helpers/canvas.ts`) and a clipboard mock. `helpers/frames.ts` steps `requestAnimationFrame` by hand; `helpers/navigation.ts` holds the mocked route (each test file calls `vi.mock("next/navigation.js", ...)` itself, since `vi.mock` hoists per file); `helpers/axe.ts` is `expectNoAxeViolations`.
- `tests/packaging.test.ts`: every file has the header; relative and `next/` imports end in `.js`; exactly the files calling hooks (other than `useId`) or `createPortal` start with `"use client"`; no hex colors in class strings.
- `scripts/check-consumer.mjs` + `scripts/consumer-fixture/`: packs the kit into a throwaway Next.js app, builds it (prerendering catches server-to-client props that can't serialize) and checks the built CSS for the theme's tokens and utilities.

## Rules

- **Server-safe by default.** `"use client"` only where hooks or browser APIs are used, as the first statement after the header. A server component never hands a client component a function or class instance: pass names (`weather="rain"`), data or rendered children.
- **Reuse the builders.** A new component takes its panel, label, heading, button, chip, field and link looks from the `*Styles.ts` builders and `Container`. No copy-pasted class strings; if two components need the same string, it goes in a styles file.
- **Look comes from the palette.** Theme colors and Tailwind's scale only; no hex in class names. Data-driven colors (team colors, mod pick colors, swatches) go through inline `style`.
- **Native props pass through** where a component wraps one element; `className` merges last through `cx`. Polymorphic components (`Panel`, `Eyebrow`, `Container`) omit `ref`.
- **Accessible.** WCAG 2.2 AA: visible focus (`FOCUS_RING`), named controls and groups, decorative art `aria-hidden`, motion off under reduced motion. Every component gets an axe check; interactive ones get keyboard tests.
- **Copy belongs to the brand.** Default strings come from `brand/identity.ts`; site routes and URLs from `site/egc.ts`.
- **Exact pins** for dependencies, ranges for peers.
- Code style: Biome (2 spaces, double quotes, 100 columns, sorted Tailwind classes). Every file starts with the `@file / @desc / @author / @created / @modified` header (`Ddd Mon D, YYYY`). Exported functions and components get JSDoc with `@function`, `@param`, `@returns`.

## Before calling a change done

```sh
bun run check && bun run typecheck && bun run test:coverage && bun run build
bun run check:consumer
```

Coverage must stay at 100% (lines, branches, functions, statements).
