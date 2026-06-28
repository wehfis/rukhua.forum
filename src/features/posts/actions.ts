"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { posts } from "@/db/schema";
import { getDb } from "@/db/client";
import { getAdminUser } from "@/lib/auth/admin";
import { postFormSchema, type PostFormValues } from "./validation";

type ActionResult = {
  ok: boolean;
  message: string;
};

function nullable(value?: string) {
  return value?.trim() ? value.trim() : null;
}

async function assertAdminAndDb(): Promise<ActionResult | { db: NonNullable<ReturnType<typeof getDb>>; userId: string }> {
  const user = await getAdminUser();

  if (!user) {
    return { ok: false, message: "Unauthorized." };
  }

  const db = getDb();

  if (!db) {
    return {
      ok: false,
      message: "DATABASE_URL is not configured. The form is ready, but cannot persist yet."
    };
  }

  return { db, userId: user.id };
}

export async function createPostAction(values: PostFormValues): Promise<ActionResult> {
  const parsed = postFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: "Please check the post fields." };
  }

  const context = await assertAdminAndDb();

  if ("ok" in context) {
    return context;
  }

  const publishedAt =
    parsed.data.status === "published" ? new Date() : null;

  await context.db.insert(posts).values({
    locale: parsed.data.locale,
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    content: parsed.data.content,
    coverImage: nullable(parsed.data.coverImage),
    status: parsed.data.status,
    commentMode: parsed.data.commentMode,
    authorId: context.userId,
    publishedAt,
    seoTitle: nullable(parsed.data.seoTitle),
    seoDescription: nullable(parsed.data.seoDescription),
    ogImage: nullable(parsed.data.ogImage)
  });

  revalidatePath(`/${parsed.data.locale}/news`);
  revalidatePath(`/${parsed.data.locale}/admin/posts`);
  return { ok: true, message: "Post saved." };
}

export async function updatePostAction(
  id: string,
  values: PostFormValues
): Promise<ActionResult> {
  const parsed = postFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: "Please check the post fields." };
  }

  const context = await assertAdminAndDb();

  if ("ok" in context) {
    return context;
  }

  await context.db
    .update(posts)
    .set({
      locale: parsed.data.locale,
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      content: parsed.data.content,
      coverImage: nullable(parsed.data.coverImage),
      status: parsed.data.status,
      commentMode: parsed.data.commentMode,
      publishedAt: parsed.data.status === "published" ? new Date() : null,
      updatedAt: new Date(),
      seoTitle: nullable(parsed.data.seoTitle),
      seoDescription: nullable(parsed.data.seoDescription),
      ogImage: nullable(parsed.data.ogImage)
    })
    .where(eq(posts.id, id));

  revalidatePath(`/${parsed.data.locale}/news/${parsed.data.slug}`);
  revalidatePath(`/${parsed.data.locale}/admin/posts`);
  return { ok: true, message: "Post updated." };
}

export async function deletePostAction(id: string, locale: string): Promise<void> {
  const context = await assertAdminAndDb();

  if ("ok" in context) {
    return;
  }

  await context.db.delete(posts).where(eq(posts.id, id));
  revalidatePath(`/${locale}/news`);
  revalidatePath(`/${locale}/admin/posts`);
}
