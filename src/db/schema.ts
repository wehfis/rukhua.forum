import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

export const postStatusEnum = pgEnum("post_status", ["draft", "published"]);
export const commentModeEnum = pgEnum("comment_mode", [
  "disabled",
  "anonymous",
  "authenticated"
]);
export const userRoleEnum = pgEnum("user_role", ["admin", "member", "user"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    locale: text("locale").notNull().default("uk"),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    content: jsonb("content").notNull(),
    coverImage: text("cover_image"),
    status: postStatusEnum("status").notNull().default("draft"),
    commentMode: commentModeEnum("comment_mode").notNull().default("anonymous"),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ogImage: text("og_image"),
    viewCount: integer("view_count").notNull().default(0)
  },
  (table) => ({
    localeSlug: uniqueIndex("posts_locale_slug_idx").on(table.locale, table.slug),
    statusPublished: index("posts_status_published_idx").on(
      table.status,
      table.publishedAt
    )
  })
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    anonymousName: text("anonymous_name"),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    postCreated: index("comments_post_created_idx").on(table.postId, table.createdAt)
  })
);

export const likes = pgTable(
  "likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    fingerprint: text("fingerprint").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    oneLikePerFingerprint: uniqueIndex("likes_post_fingerprint_idx").on(
      table.postId,
      table.fingerprint
    )
  })
);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  locale: text("locale").notNull().default("uk"),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  locale: text("locale").notNull().default("uk"),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" })
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] })
  })
);

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  locale: text("locale").notNull().default("uk"),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  locale: text("locale").notNull().default("uk"),
  title: text("title").notNull(),
  fileKey: text("file_key").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
