import { SiteFooter, SiteHeader } from "@evergreencup/ui-kit";
import { CTA_NAV, FOOTER_COLUMNS, mainNav, SOCIALS } from "@evergreencup/ui-kit/site";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "Evergreen Cup" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteHeader
          items={mainNav()}
          cta={CTA_NAV}
          account={{ href: "/signin", label: "Sign in" }}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter columns={FOOTER_COLUMNS} socials={SOCIALS} />
      </body>
    </html>
  );
}
