import "../globals.css";
import type { Metadata, Viewport } from "next";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Громадський рух розвитку України",
    template: "%s | Громадський рух розвитку України"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <SiteHeader locale={locale as Locale} />
              <main className="flex-1">{children}</main>
              <SiteFooter locale={locale as Locale} />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
