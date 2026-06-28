"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { getDb } from "@/db/client";
import { comments } from "@/db/schema";
import type { Locale } from "@/i18n/routing";
import { rateLimit } from "@/lib/security/rate-limit";

const commentSchema = z.object({
  postId: z.string().uuid(),
  slug: z.string().min(1),
  locale: z.string().min(2).max(5),
  anonymousName: z.string().max(80).optional(),
  content: z.string().min(3).max(2000)
});

export async function submitCommentAction(
  meta: { postId: string; slug: string; locale: Locale },
  _: unknown,
  formData: FormData
) {
  const parsed = commentSchema.safeParse({
    postId: meta.postId,
    slug: meta.slug,
    locale: meta.locale,
    anonymousName: formData.get("anonymousName") || undefined,
    content: formData.get("content")
  });

  if (!parsed.success) {
    return { ok: false, message: "Please check the comment and try again." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? "local";
  const limited = rateLimit({
    key: `comments:${ip}`,
    limit: 6,
    windowMs: 60_000
  });

  if (!limited.ok) {
    return { ok: false, message: "Too many comments. Please wait a minute." };
  }

  const db = getDb();

  if (db) {
    await db.insert(comments).values({
      postId: parsed.data.postId,
      anonymousName: parsed.data.anonymousName,
      content: parsed.data.content
    });
  }

  revalidatePath(`/${parsed.data.locale}/news/${parsed.data.slug}`);
  return {
    ok: true,
    message: db
      ? "Comment submitted."
      : "Comment accepted in demo mode. Configure DATABASE_URL to persist it."
  };
}
