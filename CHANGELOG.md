# Changelog

## [Unreleased]

### Added

- A demo site in `demo/`, deployed to GitHub Pages, with example components and the Evergreen Cup banner on top. The consumer check now builds it.
- MIT license, CI and Pages workflows.

### Removed

- The placeholder scenery: `Atmosphere`, `SCENE_PRESETS`, `scene()`, `Sky`, `MountRainier`, `SeattleSkyline`, `MistBand`, `TreeLine`, the tree generator, the `sway-left`, `sway-right` and `mist-drift` animations, and `PageHero`'s `atmosphere` prop. They were stand-ins for the artists' work.

## [0.1.0] - 2026-10-06

### Added

- The theme: the six PNW palettes, semantic tokens, `font-display`, atmosphere utilities and keyframes, `active-underline`, `parallax-layer`, `diag-stripes`, the `coarse:` variant and the reduced-motion rule.
- Brand data: palette, core colors, semantic tokens, identity, fonts, glyphs, favicon and sprig builders, WCAG color math, and the plain-text brand kit.
- Components: basics, brand marks and the brand page body, the PNW atmosphere (scene presets, weather canvases, parallax, hero video), forms (text fields, listbox select, checkbox, chip and card pickers), the site header, mobile menu and footer, data (table, TOC, timeline, stat band, Twitch embed, chart frames and theme), osu! (beatmap rows, mod tags, player identity) and tournament pieces (availability grids, roster card, funding meter, stretch tiers, status badges), plus an MDX element map.
- `./site`: evergreencup.org's nav, footer columns, socials and URLs.
