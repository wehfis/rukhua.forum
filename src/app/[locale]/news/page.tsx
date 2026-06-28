import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { PostCard } from "@/components/news/post-card";
import { Button } from "@/components/ui/button";
import { getPublishedPosts } from "@/features/posts/queries";
import type { Locale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
};

const pageSize = 6;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.news" });

  return createPageMetadata({
    locale,
    path: "news",
    title: t("title"),
    description: t("description"),
    image: "/images/public-dialogue.png"
  });
}

export default async function NewsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const posts = await getPublishedPosts(locale);
  const currentPage = Math.max(1, Number(pageParam ?? "1") || 1);
  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize));
  const visiblePosts = posts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="border-b border-border">
      <section className="border-b border-border bg-white py-14 md:py-20">
        <div className="container">
          <p className="text-xs font-bold uppercase text-muted-foreground">
            {t("newsPage.eyebrow")}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-6xl">
            {t("newsPage.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t("newsPage.description")}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                locale={locale}
                readMoreLabel={t("newsPage.readMore")}
                likesLabel={t("newsPage.likes")}
                commentsLabel={t("newsPage.comments")}
              />
            ))}
          </div>

          {pageCount > 1 ? (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button asChild variant="secondary" disabled={currentPage <= 1}>
                <Link href={`/${locale}/news?page=${currentPage - 1}`}>
                  {t("newsPage.previous")}
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage} / {pageCount}
              </span>
              <Button asChild variant="secondary" disabled={currentPage >= pageCount}>
                <Link href={`/${locale}/news?page=${currentPage + 1}`}>
                  {t("newsPage.next")}
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
