"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1" aria-label="Language selector">
      {routing.locales.map((locale) => {
        const href = pathname.replace(
          new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`),
          `/${locale}`
        );

        return (
          <Link
            key={locale}
            href={href || `/${locale}`}
            className={cn(
              "rounded-sm px-2 py-1 text-xs font-semibold uppercase text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              locale === currentLocale && "bg-foreground text-background hover:bg-foreground hover:text-background"
            )}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
