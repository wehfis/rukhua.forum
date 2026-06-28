import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comments/comment-section";
import { LikeButton } from "@/components/news/like-button";
import { RichTextRenderer } from "@/components/news/rich-text-renderer";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getSeedPostSlugs } from "@/features/posts/queries";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";
import { createPageMetadata, localizedUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getSeedPostSlugs().map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale, slug);

  if (!post) {
    return {};
  }

  return {
    ...createPageMetadata({
      locale,
      path: `news/${post.slug}`,
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.description,
      image: post.ogImage ?? post.coverImage
    }),
    openGraph: {
      type: "article",
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.description,
      url: localizedUrl(locale, `news/${post.slug}`),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [
        {
          url: post.ogImage?.startsWith("http")
            ? post.ogImage
            : `${getSiteUrl()}${post.ogImage ?? post.coverImage}`
        }
      ]
    }
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(post.publishedAt)
  );

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          image: `${getSiteUrl()}${post.coverImage}`,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            "@type": "Organization",
            name: post.author
          },
          publisher: {
            "@type": "Organization",
            name: "RukhUA Forum"
          },
          mainEntityOfPage: localizedUrl(locale, `news/${post.slug}`)
        }}
      />

      <header className="border-b border-border bg-white py-12 md:py-16">
        <div className="container max-w-5xl">
          <Badge>{t("newsPage.eyebrow")}</Badge>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-muted-foreground">
            {post.description}
          </p>
          <dl className="mt-8 flex flex-wrap gap-5 border-t border-border pt-5 text-sm text-muted-foreground">
            <div>
              <dt className="inline font-semibold text-foreground">
                {t("articlePage.published")}:{" "}
              </dt>
              <dd className="inline">{date}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-foreground">
                {t("articlePage.author")}:{" "}
              </dt>
              <dd className="inline">{post.author}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="container max-w-5xl py-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border bg-muted">
          <Image
            src={post.coverImage}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="container grid max-w-5xl gap-10 pb-16 lg:grid-cols-[minmax(0,1fr)_12rem]">
        <div>
          <RichTextRenderer content={post.content} />
          <div className="mt-12">
<CommentSection
               postId={post.id}
               slug={post.slug}
               locale={locale}
               mode={post.commentMode}
               labels={{
                 title: t("articlePage.comments"),
                 placeholder: t("articlePage.commentPlaceholder"),
                 name: t("articlePage.nameOptional"),
                 submit: t("articlePage.submitComment"),
                 disabled: t("articlePage.commentsDisabled"),
                 authRequired: t("articlePage.authRequired")
               }}
             />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="space-y-3 border-t border-foreground pt-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              {t("articlePage.likes")}
            </p>
            <LikeButton
              postId={post.id}
              initialCount={post.likeCount}
              label={t("newsPage.likes")}
            />
            <p className="text-sm text-muted-foreground">
              {post.commentCount} {t("newsPage.comments")}
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
