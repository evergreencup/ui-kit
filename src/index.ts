/**
 * @file src/index.ts
 * @desc @evergreencup/ui-kit: Evergreen Cup brand data and React components for Next.js. Pair with
 *       the theme: `@import "@evergreencup/ui-kit/theme.css";` after Tailwind. Client components
 *       carry their own "use client" directive, so this barrel is safe in Server Components.
 *       The MDX map is at "@evergreencup/ui-kit/mdx" and the site data at "@evergreencup/ui-kit/site".
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

// Brand data
export * from "./brand/brandText.js";
export * from "./brand/colorMath.js";
export * from "./brand/glyphs.js";
export * from "./brand/identity.js";
export * from "./brand/palette.js";
// Components: atmosphere
export * from "./components/atmosphere/Atmosphere.js";
export * from "./components/atmosphere/HeroVideo.js";
export * from "./components/atmosphere/MapleLeafDrift.js";
export * from "./components/atmosphere/MistBand.js";
export * from "./components/atmosphere/MountRainier.js";
export * from "./components/atmosphere/ParallaxScope.js";
export * from "./components/atmosphere/ParticleLayer.js";
export * from "./components/atmosphere/parallax.js";
export * from "./components/atmosphere/particles.js";
export * from "./components/atmosphere/presets.js";
export * from "./components/atmosphere/SeattleSkyline.js";
export * from "./components/atmosphere/Sky.js";
export * from "./components/atmosphere/TreeLine.js";
export * from "./components/atmosphere/trees.js";
export * from "./components/atmosphere/Weather.js";
// Components: basics
export * from "./components/basics/AutoLink.js";
export * from "./components/basics/Badge.js";
export * from "./components/basics/Button.js";
export * from "./components/basics/ButtonLink.js";
export * from "./components/basics/badgeStyles.js";
export * from "./components/basics/buttonStyles.js";
export * from "./components/basics/Container.js";
export * from "./components/basics/CopyButton.js";
export * from "./components/basics/chipStyles.js";
export * from "./components/basics/DisplayHeading.js";
export * from "./components/basics/Eyebrow.js";
export * from "./components/basics/focusStyles.js";
export * from "./components/basics/Highlight.js";
export * from "./components/basics/headingStyles.js";
export * from "./components/basics/labelStyles.js";
export * from "./components/basics/linkStyles.js";
export * from "./components/basics/Notice.js";
export * from "./components/basics/Panel.js";
export * from "./components/basics/ProgressBar.js";
export * from "./components/basics/panelStyles.js";
export * from "./components/basics/Section.js";
export * from "./components/basics/Stat.js";
export * from "./components/basics/TextLink.js";
// Components: brand
export * from "./components/brand/BrandKit.js";
export * from "./components/brand/ConiferGlyph.js";
export * from "./components/brand/HeaderWordmark.js";
export * from "./components/brand/Lockup.js";
export * from "./components/brand/MapleLeafGlyph.js";
export * from "./components/brand/PaletteGrid.js";
export * from "./components/brand/PnwArrows.js";
export * from "./components/brand/SprigStripe.js";
export * from "./components/brand/SwatchTile.js";
export * from "./components/brand/TokenRow.js";
export * from "./components/brand/TypeSpecimen.js";
export * from "./components/brand/Wordmark.js";
export * from "./components/brand/wordmarkStyles.js";
// Components: data
export * from "./components/data/ChartCard.js";
export * from "./components/data/ChartTooltip.js";
export * from "./components/data/chartTheme.js";
export * from "./components/data/DataTable.js";
export * from "./components/data/StatBand.js";
export * from "./components/data/Timeline.js";
export * from "./components/data/Toc.js";
export * from "./components/data/TwitchEmbed.js";

// Components: forms
export * from "./components/forms/Checkbox.js";
export * from "./components/forms/ChipButton.js";
export * from "./components/forms/ChoiceChips.js";
export * from "./components/forms/chipGroupStyles.js";
export * from "./components/forms/FormField.js";
export * from "./components/forms/fieldStyles.js";
export * from "./components/forms/OptionCards.js";
export * from "./components/forms/PickerGroup.js";
export * from "./components/forms/Select.js";
export * from "./components/forms/selectKeys.js";
export * from "./components/forms/Textarea.js";
export * from "./components/forms/TextInput.js";
export * from "./components/forms/ToggleChips.js";
// Components: icons
export * from "./components/icons/Icon.js";
export * from "./components/icons/icons.js";
// Components: layout
export * from "./components/layout/AccountPill.js";
export * from "./components/layout/HeroMediaPlaceholder.js";
export * from "./components/layout/MobileMenu.js";
export * from "./components/layout/NavLink.js";
export * from "./components/layout/nav.js";
export * from "./components/layout/PageHero.js";
export * from "./components/layout/SiteFooter.js";
export * from "./components/layout/SiteHeader.js";
export * from "./components/layout/SocialLinks.js";
// Components: osu
export * from "./components/osu/BeatmapRow.js";
export * from "./components/osu/ModTag.js";
export * from "./components/osu/modColors.js";
export * from "./components/osu/osuLinks.js";
export * from "./components/osu/PlayerIdentity.js";
// Components: tournament
export * from "./components/tournament/AvailabilityDisplay.js";
export * from "./components/tournament/AvailabilityGrid.js";
export * from "./components/tournament/availability.js";
export * from "./components/tournament/FundingMeter.js";
export * from "./components/tournament/gridStyles.js";
export * from "./components/tournament/RosterCard.js";
export * from "./components/tournament/StatusBadge.js";
export * from "./components/tournament/StretchTiers.js";
export * from "./components/tournament/statuses.js";
// Hooks
export * from "./hooks/useDismiss.js";
export * from "./hooks/useMediaQuery.js";
export * from "./hooks/useMounted.js";
// Utilities
export * from "./utils/cx.js";
export * from "./utils/format.js";
export * from "./utils/href.js";
export * from "./utils/random.js";
export * from "./utils/slug.js";
