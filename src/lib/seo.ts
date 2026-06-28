import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";

export function localizedUrl(locale: Locale, path = "") {
  const normalizedPath = path ? `/${path.replace(/^\//, "")}` : "";
  return `${getSiteUrl()}/${locale}${normalizedPath}`;
}

export function localizedAlternates(path = "") {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, localizedUrl(locale, path)])
  );
}

export function createPageMetadata({
  locale,
  path,
  title,
  description,
  image
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const url = localizedUrl(locale, path);
  const imageUrl = image?.startsWith("http") ? image : `${getSiteUrl()}${image ?? "/images/civic-forum-hero.png"}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: localizedAlternates(path)
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Громадський рух розвитку України",
      locale,
      type: "website",
      images: [{ url: imageUrl }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}
