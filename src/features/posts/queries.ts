import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { posts } from "@/db/schema";
import type { Locale } from "@/i18n/routing";
import { seedPosts } from "./seed";
import type { PublishedPost, RichTextDocument } from "./types";

function localizeSeedPost(post: (typeof seedPosts)[number], locale: Locale) {
  const localized = post.translations[locale] ?? post.translations.en;

  return {
    id: post.id,
    locale,
    title: localized.title,
    slug: post.slug,
    description: localized.description,
    content: localized.content,
    coverImage: post.coverImage,
    status: post.status,
    commentMode: post.commentMode,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    seoTitle: localized.title,
    seoDescription: localized.description,
    ogImage: post.ogImage
  } satisfies PublishedPost;
}

function mapDbPost(row: typeof posts.$inferSelect) {
  return {
    id: row.id,
    locale: row.locale as Locale,
    title: row.title,
    slug: row.slug,
    description: row.description,
    content: row.content as RichTextDocument,
    coverImage: row.coverImage ?? "/images/public-dialogue.png",
    status: row.status,
    commentMode: row.commentMode,
    publishedAt: row.publishedAt?.toISOString() ?? row.createdAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    author: "RukhUA Editorial Board",
    likeCount: 0,
    commentCount: 0,
    seoTitle: row.seoTitle ?? row.title,
    seoDescription: row.seoDescription ?? row.description,
    ogImage: row.ogImage ?? row.coverImage ?? "/images/public-dialogue.png"
  } satisfies PublishedPost;
}

export async function getPublishedPosts(locale: Locale) {
  const db = getDb();

  if (!db) {
    return seedPosts
      .map((post) => localizeSeedPost(post, locale))
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }

  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));

  const localizedRows = rows.filter((post) => post.locale === locale);
  return localizedRows.map(mapDbPost);
}

export async function getLatestPosts(locale: Locale, limit = 3) {
  const allPosts = await getPublishedPosts(locale);
  return allPosts.slice(0, limit);
}

export async function getPostBySlug(locale: Locale, slug: string) {
  const db = getDb();

  if (!db) {
    const post = seedPosts.find((item) => item.slug === slug);
    return post ? localizeSeedPost(post, locale) : null;
  }

  const [row] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!row || row.locale !== locale || row.status !== "published") {
    return null;
  }

  return mapDbPost(row);
}

export function getSeedPostSlugs() {
  return seedPosts.map((post) => post.slug);
}
