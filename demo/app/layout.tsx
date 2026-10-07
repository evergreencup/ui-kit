/**
 * @file demo/app/layout.tsx
 * @desc The demo shell: the Google Fonts the theme expects and the Evergreen Cup banner over the
 *       component gallery.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { BRAND } from "@evergreencup/ui-kit";
import type { ReactNode } from "react";
import { EgcBanner } from "./EgcBanner";
import "./globals.css";

export const metadata = {
  title: `${BRAND.name} UI kit`,
  description: "Example components from @evergreencup/ui-kit.",
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
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
