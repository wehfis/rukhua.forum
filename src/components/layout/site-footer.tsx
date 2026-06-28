import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";

const contact = {
  email: "info@rukhua.org",
  phone: "+380 00 000 00 00",
  whatsapp: "+380 00 000 00 00",
  viber: "+380 00 000 00 00"
};

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });

  return (
    <footer className="border-t border-border bg-[#f1efe8]">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-sm font-bold uppercase">{t("brand.name")}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            {t("metadata.home.description")}
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase">{t("landing.contacts.title")}</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="inline text-muted-foreground">{t("landing.contacts.email")}: </dt>
              <dd className="inline">{contact.email}</dd>
            </div>
            <div>
              <dt className="inline text-muted-foreground">{t("landing.contacts.phone")}: </dt>
              <dd className="inline">{contact.phone}</dd>
            </div>
            <div>
              <dt className="inline text-muted-foreground">{t("landing.contacts.whatsapp")}: </dt>
              <dd className="inline">{contact.whatsapp}</dd>
            </div>
            <div>
              <dt className="inline text-muted-foreground">{t("landing.contacts.viber")}: </dt>
              <dd className="inline">{contact.viber}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="text-sm font-bold uppercase">{t("footer.social")}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="#" className="hover:underline">
              Facebook
            </Link>
            <Link href="#" className="hover:underline">
              Telegram
            </Link>
            <Link href="#" className="hover:underline">
              YouTube
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4">
        <div className="container text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("brand.fullName")}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
