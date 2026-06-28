import { getTranslations, setRequestLocale } from "next-intl/server";
import { UploadPanel } from "@/components/admin/upload-panel";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedPosts } from "@/features/posts/queries";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const posts = await getPublishedPosts(locale);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase text-muted-foreground">Admin</p>
        <h1 className="mt-3 font-serif text-5xl">{t("admin.dashboard")}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t("admin.dbNotice")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric title={t("admin.published")} value={posts.length} />
        <Metric title={t("admin.drafts")} value={0} />
        <Metric title={t("admin.uploads")} value="S3" />
      </div>

      <UploadPanel />
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
