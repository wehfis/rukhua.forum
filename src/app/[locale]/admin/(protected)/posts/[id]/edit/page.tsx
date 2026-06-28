import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { getAllPostsByLocale } from "@/features/posts/queries";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale; id: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const posts = await getAllPostsByLocale(locale);
  const post = posts.find((item) => item.id === id || item.slug === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase text-muted-foreground">Admin</p>
        <h1 className="mt-3 font-serif text-5xl">{post.title}</h1>
      </div>
      <PostForm
        locale={locale}
        postId={post.id}
        initialValues={{
          locale,
          title: post.title,
          slug: post.slug,
          description: post.description,
          content: post.content,
          coverImage: post.coverImage,
          status: post.status,
          commentMode: post.commentMode,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          ogImage: post.ogImage
        }}
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
