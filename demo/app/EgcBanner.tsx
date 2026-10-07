/**
 * @file demo/app/EgcBanner.tsx
 * @desc The Evergreen Cup banner from haruhime.moe's homepage, rebuilt from the kit: the Seattle
 *       skyline loop through HeroVideo, the name, the line and a link to evergreencup.org, with a
 *       MotionToggle to pause the loop. The
 *       art is hotlinked from haruhime.moe, so this repo carries none of it.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { BRAND, ButtonLink, Container, HeroVideo, MotionToggle } from "@evergreencup/ui-kit";

const ART = "https://www.haruhime.moe/egc";

export function EgcBanner() {
  return (
    <Container width="wide" className="pt-6">
      <section
        aria-label={BRAND.name}
        className="relative isolate flex aspect-[2/1] overflow-hidden rounded-lg border border-evergreen-800/60 sm:aspect-[3/1] lg:aspect-[5/1]"
      >
        <HeroVideo
          poster={`${ART}/skyline-poster.webp`}
          webm={`${ART}/skyline.webm`}
          mp4={`${ART}/skyline.mp4`}
          objectPosition="35% 85%"
        />
        <div className="relative flex flex-col justify-end gap-3 p-5 sm:justify-center sm:p-7 lg:p-9">
          <p className="font-display text-3xl text-fog-50 sm:text-4xl lg:text-5xl">{BRAND.name}</p>
          <p className="text-evergreen-100 text-sm sm:text-base">{BRAND.tagline}</p>
          <ButtonLink href={`https://${BRAND.domain}`} size="sm" className="w-fit">
            {BRAND.domain}
          </ButtonLink>
        </div>
        <MotionToggle className="absolute right-3 bottom-3" />
      </section>
    </Container>
  );
}
