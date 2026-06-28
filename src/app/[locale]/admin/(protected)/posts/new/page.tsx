import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostForm } from "@/components/admin/post-form";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function NewPostPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase text-muted-foreground">Admin</p>
        <h1 className="mt-3 font-serif text-5xl">{t("admin.newPost")}</h1>
      </div>
      <PostForm
        locale={locale}
        labels={{
          title: t("admin.title"),
          slug: t("admin.slug"),
          description: t("admin.description"),
          coverImage: t("admin.coverImage"),
          status: t("admin.status"),
          commentMode: t("admin.commentMode"),
          seoTitle: t("admin.seoTitle"),
          seoDescription: t("admin.seoDescription"),
          ogImage: t("admin.ogImage"),
          saveDraft: t("admin.saveDraft"),
          publish: t("admin.publish"),
          preview: t("admin.preview")
        }}
      />
    </div>
  );
}
