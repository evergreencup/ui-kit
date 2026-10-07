/**
 * @file demo/app/layout.tsx
 * @desc The demo shell: the Google Fonts the theme expects, the Evergreen Cup banner, the kit's
 *       header with in-page nav, and the footer with evergreencup.org's columns and socials.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { BRAND, SiteFooter, SiteHeader } from "@evergreencup/ui-kit";
import { FOOTER_COLUMNS, SOCIALS } from "@evergreencup/ui-kit/site";
import type { ReactNode } from "react";
import { EgcBanner } from "./EgcBanner";
import { SECTIONS } from "./sections";
import "./globals.css";

export const metadata = {
  title: `${BRAND.name} UI kit`,
  description: "Every component in @evergreencup/ui-kit, live.",
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body className="flex min-h-full flex-col">
        <EgcBanner />
        <SiteHeader
          items={SECTIONS.slice(0, 5).map((s) => ({ href: `#${s.id}`, label: s.title }))}
          cta={{ href: "https://github.com/evergreencup/ui-kit", label: "GitHub" }}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter columns={FOOTER_COLUMNS} socials={SOCIALS} />
      </body>
    </html>
  );
}
