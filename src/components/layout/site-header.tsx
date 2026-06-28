import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <Link
          href={`/${locale}`}
          className="flex min-w-0 items-center gap-3 text-sm font-bold uppercase tracking-normal"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-foreground">
            <Newspaper className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="max-w-[14rem] truncate sm:max-w-none">
            {t("brand.name")}
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm">
          <Link className="px-2 py-1 hover:underline" href={`/${locale}#about`}>
            {t("nav.home")}
          </Link>
          <Link className="px-2 py-1 hover:underline" href={`/${locale}/news`}>
            {t("nav.news")}
          </Link>
          <Link className="px-2 py-1 hover:underline" href={`/${locale}#platform`}>
            {t("nav.platform")}
          </Link>
          <Button asChild size="sm" variant="secondary">
            <Link href={`/${locale}#join`}>{t("nav.join")}</Link>
          </Button>
          <LocaleSwitcher currentLocale={locale} />
        </nav>
      </div>
    </header>
  );
}
