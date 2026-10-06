import {
  BeatmapRow,
  BrandKit,
  ButtonLink,
  Checkbox,
  Container,
  DataTable,
  FundingMeter,
  Notice,
  PageHero,
  RosterCard,
  Section,
  StatBand,
  StatusBadge,
  Timeline,
  Toc,
} from "@evergreencup/ui-kit";
import { KOFI_URL } from "@evergreencup/ui-kit/site";

export default function Home() {
  return (
    <>
      <PageHero
        eyebrow="Pacific Northwest osu! LAN"
        title="Evergreen Cup"
        lead="Built by the community."
        atmosphere="home"
      >
        <ButtonLink href="/register" size="lg">
          Register
        </ButtonLink>
        <ButtonLink href={KOFI_URL} variant="outline" size="lg">
          Donate
        </ButtonLink>
      </PageHero>
      <Container className="grid gap-10 py-16 lg:grid-cols-[14rem_1fr]">
        <Toc
          entries={[
            { id: "pools", num: "01", title: "Pools" },
            { id: "teams", num: "02", title: "Teams" },
          ]}
        />
        <div className="flex flex-col gap-12">
          <Section id="pools" num="01" title="Pools">
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
            <DataTable
              caption="SR"
              columns={[{ label: "Round" }, { label: "SR", mono: true }]}
              rows={[["Finals", "7.0"]]}
            />
          </Section>
          <Section id="teams" num="02" title="Teams">
            <RosterCard
              tag="SEA"
              name="Rain City"
              members={[{ username: "cap", isCaptain: true }]}
            />
            <StatusBadge status="waitlisted" />
            <Notice>Finalized before qualifiers.</Notice>
            <Checkbox id="c" label="I used to live in the PNW" />
            <FundingMeter raisedCents={60000} goalCents={100000} count={12} />
          </Section>
          <StatBand
            items={[
              { label: "Right now", value: "Round of 16" },
              { label: "Progress", value: "3 of 7" },
            ]}
          />
          <Timeline
            entries={[
              {
                id: "lan",
                title: "Grand Finals",
                status: "future",
                finale: true,
                date: { primary: "Oct 24" },
                details: { summary: "2 matches", content: <p>Matches</p> },
              },
            ]}
          />
          <BrandKit />
        </div>
      </Container>
    </>
  );
}
