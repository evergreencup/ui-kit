# Changelog

## [Unreleased]

### Added

- A demo site in `demo/`, deployed to GitHub Pages, with example components and the Evergreen Cup banner on top. The consumer check now builds it.
- MIT license, CI and Pages workflows.
- Region map: `RegionMap`, the client `RegionPicker` (keyboard radio group over the map), the precomputed path data and `scripts/build-region-map.mjs` to regenerate it.
- Crowdfund display: `DonorWall`, `DonorCard`, `TopDonorCallout`, `DonorBanner`, `BannerPicker` and the banner presets.
- `@evergreencup/ui-kit/charts`: `CumulativeRaisedChart`, `DonationSourceDonut`, `RegistrationStatusChart` and their tooltips, with `recharts` as an optional peer.
- Soundtrack: `TrackCard`, `TrackPlayer` and the embed helpers.
- `ComingSoon`, `ComingSoonNote`, `SubmitButton`, `SignInWithOsu`, `formatShortDate`, `rovingKey`.
- Demo sections for each.
- `SkipLink`, and `SiteHeader`'s `skipTo` prop to render one before the logo.
- `MotionToggle`: one pause button for the hero video, weather and leaf (WCAG 2.2.2), remembered in localStorage; `useMotionPaused`, `setMotionPaused`, `PauseIcon`, `PlayIcon`.
- `useFocusTrap`, `gridMove`, `ChartDataTable`, `INK_FALLBACK`, `AA_TEXT`, and an `ink` on each `MOD_COLORS` entry.

### Fixed (accessibility pass)

- `MobileMenu` moves focus into the drawer, keeps Tab inside it while open, and hands focus back to the toggle on close. The toggle has `aria-controls`.
- `Select` hands focus back to its trigger after a pick or Escape; Tab closes the list and moves on instead of dropping focus.
- `AvailabilityGrid`: the 72 hour cells are one Tab stop with arrow, Home and End navigation; hours keep a 24px minimum width (the grid scrolls sideways on narrow screens); the live region announces the picked runs instead of every hover.
- Charts carry a visually hidden data table.
- A required `Select` says "(required)" in its name, since a button can't take `aria-required`.
- `Button`: `disabled={false}` no longer re-enables a pending button.
- Contrast: the `osu` button is `pink-600` (white text was 3.6:1 on `pink-500`); `ModTag` text uses the lighter `ink`; `inkFor` falls back to black or white where neither brand ink reaches 4.5:1 (bark-400, fog-600 swatches); past `Timeline` cards dim their surface instead of their text.
- Focus rings use `outline-hidden`, so a focus outline still shows in Windows forced-colors mode.

### Removed

- The placeholder scenery: `Atmosphere`, `SCENE_PRESETS`, `scene()`, `Sky`, `MountRainier`, `SeattleSkyline`, `MistBand`, `TreeLine`, the tree generator, the `sway-left`, `sway-right` and `mist-drift` animations, and `PageHero`'s `atmosphere` prop. They were stand-ins for the artists' work.

## [0.1.0] - 2026-10-06

### Added

- The theme: the six PNW palettes, semantic tokens, `font-display`, atmosphere utilities and keyframes, `active-underline`, `parallax-layer`, `diag-stripes`, the `coarse:` variant and the reduced-motion rule.
- Brand data: palette, core colors, semantic tokens, identity, fonts, glyphs, favicon and sprig builders, WCAG color math, and the plain-text brand kit.
- Components: basics, brand marks and the brand page body, the PNW atmosphere (scene presets, weather canvases, parallax, hero video), forms (text fields, listbox select, checkbox, chip and card pickers), the site header, mobile menu and footer, data (table, TOC, timeline, stat band, Twitch embed, chart frames and theme), osu! (beatmap rows, mod tags, player identity) and tournament pieces (availability grids, roster card, funding meter, stretch tiers, status badges), plus an MDX element map.
- `./site`: evergreencup.org's nav, footer columns, socials and URLs.
