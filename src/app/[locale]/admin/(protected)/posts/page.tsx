import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePostAction } from "@/features/posts/actions";
import { getAllPostsByLocale } from "@/features/posts/queries";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminPostsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const posts = await getAllPostsByLocale(locale);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Admin</p>
          <h1 className="mt-3 font-serif text-5xl">{t("admin.posts")}</h1>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/posts/new`}>
            <Plus className="h-4 w-4" />
            {t("admin.newPost")}
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="border-b border-border px-4 py-3">{t("admin.title")}</th>
              <th className="border-b border-border px-4 py-3">{t("admin.status")}</th>
              <th className="border-b border-border px-4 py-3">{t("newsPage.published")}</th>
              <th className="border-b border-border px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-4">
                  <p className="font-semibold">{post.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{post.slug}</p>
                </td>
                <td className="px-4 py-4">{post.status}</td>
                <td className="px-4 py-4">
                  {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                    new Date(post.publishedAt)
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/${locale}/admin/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <form action={deletePostAction.bind(null, post.id, locale)}>
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          if (!confirm("Delete this post?")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
