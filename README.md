# @evergreencup/ui-kit

The Evergreen Cup brand and React components for Next.js, in one package: the Pacific Northwest palette as a Tailwind 4 theme, the wordmark and conifer glyph, the layered PNW atmosphere backdrops, buttons, panels, form fields, the site header and footer, tables, chart frames, osu! mappool rows and the tournament pieces (availability grids, rosters, the crowdfund meter).

Distilled from `evergreencup.org/apps/web`. Peer dependencies: Next.js 16, React 19, Tailwind CSS 4.1+. One runtime dependency: `tailwind-merge`.

Not published. Use it from a workspace or a packed tarball:

```sh
bun run build && bun pm pack            # makes evergreencup-ui-kit-0.1.0.tgz
bun add ./evergreencup-ui-kit-0.1.0.tgz # in the app
```

## Setup (five minutes)

**1. Theme.** In the app's global stylesheet, after Tailwind:

```css
@import "tailwindcss";
@import "@evergreencup/ui-kit/theme.css";
```

The theme defines the palettes (`evergreen`, `cascade`, `bark`, `moss`, `fog`, `rain`), the semantic tokens (`background`, `surface`, `surface-elevated`, `foreground`, `muted`, `accent`), the `font-display` utility, the atmosphere animations (`sway-left`, `sway-right`, `mist-drift`, `leaf-drift`), `active-underline`, `parallax-layer`, `diag-stripes`, the `coarse:` variant, one reduced-motion rule, and the dark page background. Its `@source "./"` line points Tailwind at the kit's compiled files, so every class the components use is generated.

**2. Fonts.** All three come from `next/font/google`. The kit ships no font files or art.

```tsx
// app/layout.tsx
import { Big_Shoulders_Display, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders_Display({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});
const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
```

**3. Favicon.** `app/icon.svg/route.ts`, or write the string to `app/icon.svg` once:

```ts
import { faviconSvg } from "@evergreencup/ui-kit";
export const GET = () => new Response(faviconSvg(), { headers: { "content-type": "image/svg+xml" } });
```

**4. MDX** (legal pages, disclaimers):

```ts
// mdx-components.tsx
import { mdxComponents } from "@evergreencup/ui-kit/mdx";
export const useMDXComponents = () => mdxComponents;
```

**5. Shell.** The site's own nav, footer columns and socials are in `@evergreencup/ui-kit/site`:

```tsx
import { AccountPill, SiteFooter, SiteHeader } from "@evergreencup/ui-kit";
import { ACCOUNT_NAV, CTA_NAV, FOOTER_COLUMNS, mainNav, SOCIALS, withHref } from "@evergreencup/ui-kit/site";

<SiteHeader
  items={mainNav({ soundtrack: anyTrackRevealed })}
  cta={CTA_NAV}
  account={session ? ACCOUNT_NAV.signedIn : ACCOUNT_NAV.signedOut}
  actions={session ? <AccountPill username={user.username} avatarUrl={user.avatarUrl} isAdmin={user.isAdmin} /> : null}
/>
<main className="flex-1">{children}</main>
<SiteFooter columns={FOOTER_COLUMNS} socials={withHref(SOCIALS, "osu! forum", forumPostUrl)} />
```

## A page in ten lines

```tsx
import { Container, PageHero, Section, Toc, DataTable, Notice, ButtonLink } from "@evergreencup/ui-kit";

export default function RulesPage() {
  return (
    <>
      <PageHero eyebrow="Rules" title="How the cup runs" lead="Format, mod buckets and match procedure." atmosphere="rules">
        <ButtonLink href="/register" size="lg">Register</ButtonLink>
      </PageHero>
      <Container className="grid gap-10 py-16 lg:grid-cols-[14rem_1fr]">
        <Toc entries={[{ id: "format", num: "01", title: "Format" }]} />
        <Section id="format" num="01" title="Format">
          <DataTable caption="Star rating per round" columns={[{ label: "Round" }, { label: "SR", mono: true }]} rows={[["Finals", "6.8–7.2"]]} />
          <Notice title="Pending · ref team">Finalized before qualifiers open.</Notice>
        </Section>
      </Container>
    </>
  );
}
```

## What's in it

Everything is exported from `@evergreencup/ui-kit` (server-safe barrel: client files carry their own `"use client"`).

### Brand data

| Export | What |
| --- | --- |
| `BRAND`, `REGIONS`, `FONTS` | Name, short name, domain, tagline, legal line; the five regions; the three type families with roles, weights, samples, notes |
| `PALETTE`, `PALETTE_ORDER`, `PALETTE_INFO`, `swatches(name)` | Every step's hex; palettes in order with labels and descriptions; a palette's steps with readable ink |
| `CORE_COLORS`, `SEMANTIC_TOKENS` | The five committed colors (Mist, Evergreen, Cascade, Bark, Pitch); the semantic tokens and their hexes |
| `contrastRatio`, `luminance`, `inkFor`, `hexToRgb`, `INK` | WCAG color math |
| `CONIFER_PATH`, `CONIFER_TRUNK`, `MAPLE_LEAF`, `SPRIG`, `faviconSvg()`, `sprigDataUri()` | The marks as data |
| `brandText()` | The plain-text brand kit for a designer handoff route |

### Components

| Group | Components |
| --- | --- |
| Basics | `Button` and `ButtonLink` (variants `primary`, `outline`, `ghost`, `icon`, `osu`; sizes `sm`, `md`, `lg`; `pill`; `pending`), `AutoLink`, `TextLink`, `Panel`, `Container`, `Section`, `DisplayHeading`, `Eyebrow`, `Badge`, `Notice`, `Stat`, `ProgressBar`, `Highlight`, `CopyButton` (client) |
| Class builders | `buttonClasses`, `panelClasses`, `labelClasses`, `headingClasses`, `chipClasses`, `fieldClasses`, plus `FOCUS_RING`, `HAIRLINE`, `DIVIDER`, `GUTTERS`, `CONTAINER_WIDTHS`, `LINK_CLASSES`, `STATUS_TONE_CLASSES` |
| Brand | `Wordmark` (full, short, icon), `HeaderWordmark`, `ConiferGlyph`, `MapleLeafGlyph`, `PnwArrows`, `Lockup`, `SprigStripe`, `SwatchTile`, `PaletteGrid`, `TypeSpecimen`, `TokenRow`, `BrandKit` (the whole brand page body) |
| Atmosphere | `Atmosphere` (presets: `home`, `rules`, `pools`, `schedule`, `teams`, `stream`, `donate`, `contributors`, `register`, `soundtrack`, `brand`, `forest`, or scene overrides), `HeroVideo` (client), `Sky`, `MountRainier`, `SeattleSkyline`, `MistBand`, `TreeLine`, `RainLayer`, `SnowLayer`, `ParticleLayer` (client), `MapleLeafDrift` (client), `ParallaxScope` (client), `scene()`, `SCENE_PRESETS` |
| Forms | `TextInput`, `Textarea`, `Select` (client listbox), `Checkbox`, `FormField`, `ToggleChips`, `ChoiceChips`, `OptionCards`, `ChipButton`, `PickerGroup`. Text fields and Select take an optional `label`; with it they render inside `FormField` wired to `hint` and `error` |
| Layout | `SiteHeader`, `SiteFooter`, `MobileMenu` (client), `NavLink` (client), `SocialLinks`, `PageHero`, `HeroMediaPlaceholder`, `AccountPill`, `isActivePath`, `byLabelLength` |
| Data | `DataTable`, `Toc`, `Timeline` (schedule rail with statuses, finale and expandable details), `StatBand`, `TwitchEmbed` + `twitchPlayerUrl`, `ChartCard`, `ChartTooltip`, `ChartLegend`, and `chartTheme` values (`SERIES_COLORS`, `seriesColor`, `AXIS`, `AXIS_TICK`, `CATEGORY_TICK`, `GRID`, `CURSOR`) to spread into Recharts or any SVG chart library |
| osu! | `BeatmapRow` (a mappool slot), `ModTag`, `PlayerIdentity`, `MOD_BUCKETS`, `MOD_COLORS`, `modColor`, `profileUrl`, `beatmapUrl`, `coverUrl`, `slotLabel`, `GUEST_AVATAR` |
| Tournament | `AvailabilityGrid` (client picker), `AvailabilityDisplay` (read-only, heat mode), `RosterCard`, `FundingMeter`, `StretchTiers`, `StatusBadge`, `STATUSES`, and the availability math (`DAYS`, `HOURS`, `slotId`, `rangeIds`, `toggleIds`, `applyIds`, `overlapLevels`, `fullOverlap`, `summarizeAvailability`) |
| Icons | `DiscordIcon`, `TwitchIcon`, `YouTubeIcon`, `KofiIcon`, `OsuIcon`, `BracketIcon`, `MenuIcon`, `CloseIcon`, `ChevronDownIcon`, `CheckIcon`, `ArrowRightIcon`, `ExternalIcon`, `StarIcon`; `Icon` + `createIcon` for more. Decorative unless given a `title` |
| Utilities | `cx`, `formatUsd`, `formatMmSs`, `plural`, `padCount`, `percentOf`, `slugify`, `isExternalHref`, `mulberry32`, `randRange`, `useMediaQuery`, `useMotionEnabled`, `useMounted`, `useEscapeKey`, `useOutsideClick`, `useScrollLock` |

### Conventions

- **Server-safe by default.** Only files with hooks or browser APIs carry `"use client"`. Client components never receive functions from the kit's own server components (the weather layers pass a `weather: "rain" | "snow"` name, not an engine).
- **className merges last** through `cx` (tailwind-merge), so a caller's class replaces a built-in one on the same property.
- **One look per concept.** Panels, labels, headings, buttons, chips, fields and links each come from one class builder. Reach for the builder before writing classes by hand.
- **Motion respects the visitor.** Weather canvases, the leaf and the hero video never render under `prefers-reduced-motion`; parallax is off for reduced motion and touch; CSS animations stop under the theme's one rule.
- **Accessible.** Every component has an axe check in its tests; keyboard paths (Select, AvailabilityGrid, MobileMenu) have keyboard tests.

## Development

```sh
bun install
bun run check          # Biome
bun run typecheck
bun run test:coverage  # 100% lines, branches, functions, statements
bun run build          # tsc to dist/, copies theme.css
bun run check:consumer # packs the kit into a throwaway Next.js app, builds it, checks the CSS
```
