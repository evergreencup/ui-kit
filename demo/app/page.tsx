/**
 * @file demo/app/page.tsx
 * @desc The demo page: example components from @evergreencup/ui-kit, one section per group.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import {
  ArrowRightIcon,
  Badge,
  BeatmapRow,
  BracketIcon,
  BrandKit,
  Button,
  ChartCard,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  ComingSoon,
  ComingSoonNote,
  Container,
  CopyButton,
  DataTable,
  DiscordIcon,
  type Donor,
  DonorBanner,
  DonorWall,
  ExternalIcon,
  FundingMeter,
  Highlight,
  KofiIcon,
  MenuIcon,
  MOD_BUCKETS,
  ModTag,
  Notice,
  OsuIcon,
  Panel,
  PlayerIdentity,
  ProgressBar,
  RegionMap,
  RosterCard,
  Section,
  STATUSES,
  StarIcon,
  Stat,
  StatBand,
  type Status,
  StatusBadge,
  seriesColor,
  Timeline,
  TopDonorCallout,
  TrackCard,
  TwitchIcon,
  YouTubeIcon,
} from "@evergreencup/ui-kit";
import {
  CumulativeRaisedChart,
  DonationSourceDonut,
  RegistrationStatusChart,
} from "@evergreencup/ui-kit/charts";
import type { ReactNode } from "react";
import { AvailabilityDemo, BannerDemo, FormsDemo, RegionDemo, SubmitDemo } from "./Interactive";
import { BANNER_VARIANTS } from "./samples";
import { section } from "./sections";

const DemoSection = ({ id, children }: { id: string; children: ReactNode }) => {
  const { num, title } = section(id);
  return (
    <Section id={id} num={num} title={title}>
      {children}
    </Section>
  );
};

const Row = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
);

const TIERS = [
  { thresholdCents: 50000, label: "Prize pool", description: "Every dollar past costs goes here." },
  { thresholdCents: 100000, label: "Venue upgrade", description: "A bigger room and a stage." },
  { thresholdCents: 150000, label: "Travel fund", description: "Help a finalist fly in." },
];

const ICONS = {
  DiscordIcon,
  TwitchIcon,
  YouTubeIcon,
  KofiIcon,
  OsuIcon,
  BracketIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowRightIcon,
  ExternalIcon,
  StarIcon,
};

const DONORS: Donor[] = [
  {
    id: "1",
    name: "cedar",
    amountCents: 25000,
    osuId: 2,
    message: "For the Rain City crew.",
    recurring: true,
    date: "2026-09-20",
  },
  { id: "2", name: "salal", amountCents: 5000, message: "See you at the LAN!", date: "2026-09-22" },
  { id: "3", name: "Anonymous", amountCents: 10000, date: "2026-09-25" },
  { id: "4", name: "drizzle", amountCents: 2000, currency: "CAD", date: "2026-09-28" },
];
const TOP = [...DONORS].sort((a, b) => b.amountCents - a.amountCents);

const RAISED = [3000, 0, 12000, 4500, 25000, 8000, 10000].map((cents, i, all) => ({
  day: `2026-09-${String(20 + i).padStart(2, "0")}`,
  usdCents: cents,
  cumulativeUsdCents: all.slice(0, i + 1).reduce((a, b) => a + b, 0),
  count: cents > 0 ? 1 + (i % 3) : 0,
}));

const SIGNUPS = [4, 9, 15, 22, 31, 38, 44].map((n, week) => ({ week, n }));

export default function Home() {
  return (
    <Container width="wide" className="py-12">
      <h1 className="sr-only">@evergreencup/ui-kit example components</h1>
      <div className="flex flex-col gap-16">
        <DemoSection id="brand">
          <BrandKit />
        </DemoSection>

        <DemoSection id="basics">
          <Row>
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="osu">Sign in with osu!</Button>
            <Button pill>Pill</Button>
            <Button pending>Saving</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <CopyButton value="https://evergreencup.org" label="Copy link" variant="outline" />
          </Row>
          <Row>
            {(["success", "warning", "info", "danger", "neutral"] as const).map((tone) => (
              <Badge key={tone} tone={tone}>
                {tone}
              </Badge>
            ))}
          </Row>
          <Notice title="Pending · ref team">
            Pools are finalized before qualifiers open. <Highlight>Oct 24</Highlight> is the LAN.
          </Notice>
          <Panel className="grid gap-6 p-6 sm:grid-cols-3">
            <Stat label="Players" value="64" />
            <Stat label="Teams" value="16" variant="inline" />
            <Stat label="Raised" value="$1,240" variant="headline" />
          </Panel>
          <ProgressBar label="Qualifiers played" value={42} max={64} />
        </DemoSection>

        <DemoSection id="forms">
          <FormsDemo />
        </DemoSection>

        <DemoSection id="data">
          <DataTable
            caption="Star rating per round"
            columns={[
              { label: "Round" },
              { label: "Best of", mono: true },
              { label: "SR", mono: true },
            ]}
            rows={[
              ["Qualifiers", "–", "5.6–6.0"],
              ["Round of 16", "9", "6.0–6.4"],
              ["Semifinals", "11", "6.5–6.9"],
              ["Grand Finals", "13", "6.8–7.2"],
            ]}
          />
          <StatBand
            items={[
              { label: "Right now", value: "Round of 16" },
              { label: "Progress", value: "3 of 7" },
              { label: "Next match", value: "Sat 3pm" },
            ]}
          />
          <ChartCard
            eyebrow="Signups"
            title="Players by week"
            headline="44"
            headlineLabel="so far"
            aspect="wide"
          >
            <svg
              viewBox="0 0 70 30"
              className="size-full"
              role="img"
              aria-label="Signups rising each week"
            >
              {SIGNUPS.map(({ week: i, n }) => (
                <rect
                  key={`week-${i}`}
                  x={i * 10 + 2}
                  y={30 - n / 1.6}
                  width={6}
                  height={n / 1.6}
                  fill={seriesColor(0)}
                  rx={1}
                />
              ))}
            </svg>
          </ChartCard>
          <Timeline
            entries={[
              { id: "reg", title: "Registration", status: "past", date: { primary: "Sep 1" } },
              {
                id: "quals",
                title: "Qualifiers",
                status: "active",
                date: { primary: "Oct 3" },
                blurb: "Online, all regions.",
              },
              { id: "ro16", title: "Round of 16", status: "next", date: { primary: "Oct 10" } },
              {
                id: "lan",
                title: "Grand Finals",
                status: "future",
                finale: true,
                date: { primary: "Oct 24", weekday: "Sat" },
                details: { summary: "At the LAN", content: <p>Seattle, in person.</p> },
              },
            ]}
          />
        </DemoSection>

        <DemoSection id="region">
          <div className="grid gap-8 lg:grid-cols-2">
            <RegionDemo />
            <RegionMap highlight={["Washington", "Oregon"]} className="max-w-xl" />
          </div>
        </DemoSection>

        <DemoSection id="tournament">
          <div className="grid gap-4 md:grid-cols-2">
            <RosterCard
              tag="SEA"
              name="Rain City"
              color="#49b86a"
              members={[
                { username: "cedar", isCaptain: true },
                { username: "salal" },
                { username: "drizzle" },
              ]}
            />
            <RosterCard
              tag="PDX"
              name="Bridgetown"
              color="#4aa3d8"
              note="Looking for a fourth"
              members={[{ username: "madrona", isCaptain: true }, { username: "sitka" }]}
            />
          </div>
          <Row>
            {(Object.keys(STATUSES) as Status[]).map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </Row>
          <FundingMeter raisedCents={124000} goalCents={100000} count={38} tiers={TIERS} />
          <AvailabilityDemo />
        </DemoSection>

        <DemoSection id="crowdfund">
          <TopDonorCallout donor={TOP[0] ?? null} />
          <DonorWall latest={DONORS} top={TOP} level={3} />
          <DonorBanner
            name="cedar"
            subtitle="Founding donor"
            variant={BANNER_VARIANTS[0] as (typeof BANNER_VARIANTS)[number]}
            className="max-w-xl"
          />
          <BannerDemo />
        </DemoSection>

        <DemoSection id="charts">
          <p className="text-fog-400 text-sm">
            From <code>@evergreencup/ui-kit/charts</code>, which needs <code>recharts</code>.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              eyebrow="Crowdfund"
              title="Raised over time"
              headline="$625"
              headlineLabel="total"
            >
              <CumulativeRaisedChart data={RAISED} goalUsdCents={100000} width={520} height={240} />
            </ChartCard>
            <ChartCard eyebrow="Crowdfund" title="By source" aspect="square">
              <DonationSourceDonut
                width={300}
                height={256}
                slices={[
                  { label: "Ko-fi", usdCents: 48000, count: 9 },
                  { label: "Manual", usdCents: 14500, count: 3 },
                ]}
              />
            </ChartCard>
            <ChartCard eyebrow="Signups" title="Registrations by status">
              <RegistrationStatusChart
                width={520}
                height={240}
                rows={[
                  {
                    kind: "player",
                    approved: 32,
                    pending: 8,
                    waitlisted: 4,
                    rejected: 2,
                    withdrawn: 1,
                  },
                  {
                    kind: "staff",
                    approved: 9,
                    pending: 3,
                    waitlisted: 0,
                    rejected: 0,
                    withdrawn: 1,
                  },
                ]}
              />
            </ChartCard>
          </div>
        </DemoSection>

        <DemoSection id="soundtrack">
          <div className="grid gap-4 lg:grid-cols-2">
            <TrackCard
              track={{
                index: 1,
                title: "Cascadia",
                roundLabel: "Qualifiers",
                lengthSeconds: 142,
                audioUrl: "https://example.com/cascadia",
              }}
              songwriters={[{ name: "salal" }, { name: "drizzle" }, { name: "madrona" }]}
            />
            <TrackCard track={{ index: 2, title: "Under the Fog", roundLabel: "Grand Finals" }} />
          </div>
        </DemoSection>

        <DemoSection id="pages">
          <SubmitDemo />
          <Panel tone="solid" padding="none" className="flex">
            <ComingSoon as="section" lead="Announcement coming soon. Signups open shortly after." />
          </Panel>
          <ComingSoonNote />
        </DemoSection>

        <DemoSection id="osu">
          <ul className="flex flex-col gap-2">
            <BeatmapRow
              slot={{
                mod: "HD",
                index: 1,
                beatmapId: 1,
                beatmapsetId: 1,
                artist: "xi",
                title: "FREEDOM DiVE",
                difficulty: "FOUR DIMENSIONS",
                starRating: 7.07,
                bpm: 222,
                lengthSeconds: 263,
                cs: 4,
                ar: 9.3,
                od: 8,
                hp: 6,
              }}
            />
          </ul>
          <Row>
            {MOD_BUCKETS.map((mod) => (
              <ModTag key={mod} mod={mod} index={1} />
            ))}
          </Row>
          <Row>
            <PlayerIdentity username="peppy" osuId={2} />
            <PlayerIdentity username="cedar" sub="Rain City" highlight />
          </Row>
        </DemoSection>

        <DemoSection id="icons">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
            {Object.entries(ICONS).map(([name, Glyph]) => (
              <Panel key={name} className="flex flex-col items-center gap-2 p-4">
                <Glyph className="size-6 text-evergreen-300" />
                <span className="text-center font-mono text-[10px] text-fog-400">{name}</span>
              </Panel>
            ))}
          </div>
        </DemoSection>
      </div>
    </Container>
  );
}
