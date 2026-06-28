import { z } from "zod";
import { routing } from "@/i18n/routing";

const localeValues = routing.locales as unknown as [string, ...string[]];

export const richTextDocumentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.unknown())
});

export const postFormSchema = z.object({
  locale: z.enum(localeValues),
  title: z.string().min(3).max(180),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(500),
  content: richTextDocumentSchema,
  coverImage: z.string().max(500).optional(),
  status: z.enum(["draft", "published"]),
  commentMode: z.enum(["disabled", "anonymous", "authenticated"]),
  seoTitle: z.string().max(180).optional(),
  seoDescription: z.string().max(300).optional(),
  ogImage: z.string().max(500).optional()
});

export type PostFormValues = z.infer<typeof postFormSchema>;
