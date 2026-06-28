import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uk", "en", "de", "fr", "it"],
  defaultLocale: "uk",
  localePrefix: "as-needed"
});

export type Locale = (typeof routing.locales)[number];
