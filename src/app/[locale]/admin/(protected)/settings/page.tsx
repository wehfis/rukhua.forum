import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminSettingsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase text-muted-foreground">Admin</p>
        <h1 className="mt-3 font-serif text-5xl">{t("admin.settings")}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Disabled</CardTitle>
            <CardDescription>No public discussion on selected posts.</CardDescription>
          </CardHeader>
        </Card>
<Card>
           <CardHeader>
             <CardTitle>Anonymous</CardTitle>
             <CardDescription>Optional name plus comment, protected by rate limiting.</CardDescription>
           </CardHeader>
         </Card>
        <Card>
          <CardHeader>
            <CardTitle>Authenticated</CardTitle>
            <CardDescription>Prepared for future public user accounts.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>S3 Storage</CardTitle>
          <CardDescription>
            Accepted object roots: posts/, documents/, uploads/, avatars/. Use
            NEXT_PUBLIC_ASSET_BASE_URL for CloudFront later.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
