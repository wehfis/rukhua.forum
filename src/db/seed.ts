import { posts, users } from "./schema";
import { closeDb, getDb } from "./client";
import { seedPosts } from "../features/posts/seed";
import { routing, type Locale } from "../i18n/routing";

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is required to seed the database.");
  }

  const adminUuid = "00000000-0000-0000-0000-000000000000";
  await db
    .insert(users)
    .values({
      id: adminUuid,
      email: "admin@rukhua.com",
      role: "admin"
    })
    .onConflictDoNothing();

  for (const seedPost of seedPosts) {
    for (const locale of routing.locales) {
      const localized = seedPost.translations[locale as Locale];

      await db
        .insert(posts)
        .values({
          locale,
          title: localized.title,
          slug: seedPost.slug,
          description: localized.description,
          content: localized.content,
          coverImage: seedPost.coverImage,
          status: seedPost.status,
          commentMode: seedPost.commentMode,
          publishedAt: new Date(seedPost.publishedAt),
          createdAt: new Date(seedPost.createdAt),
          updatedAt: new Date(seedPost.updatedAt),
          seoTitle: localized.title,
          seoDescription: localized.description,
          ogImage: seedPost.ogImage
        })
        .onConflictDoNothing();
    }
  }
}

main()
  .then(async () => {
    await closeDb();
    console.log("Seed complete.");
  })
  .catch(async (error) => {
    await closeDb();
    console.error(error);
    process.exit(1);
  });
