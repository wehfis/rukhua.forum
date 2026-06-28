"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, Save, Send } from "lucide-react";
import { createPostAction, updatePostAction } from "@/features/posts/actions";
import type { RichTextDocument } from "@/features/posts/types";
import { postFormSchema, type PostFormValues } from "@/features/posts/validation";
import type { Locale } from "@/i18n/routing";
import { slugify } from "@/lib/slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "./rich-text-editor";

const emptyDocument: RichTextDocument = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "" }]
    }
  ]
};

export function PostForm({
  locale,
  labels,
  initialValues,
  postId
}: {
  locale: Locale;
  labels: Record<string, string>;
  initialValues?: Partial<PostFormValues>;
  postId?: string;
}) {
  const [content, setContent] = useState<RichTextDocument>(
    (initialValues?.content as RichTextDocument | undefined) ?? emptyDocument
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultValues = useMemo<PostFormValues>(
    () => ({
      locale,
      title: initialValues?.title ?? "",
      slug: initialValues?.slug ?? "",
      description: initialValues?.description ?? "",
      content,
      coverImage: initialValues?.coverImage ?? "",
      status: initialValues?.status ?? "draft",
      commentMode: initialValues?.commentMode ?? "anonymous",
      seoTitle: initialValues?.seoTitle ?? "",
      seoDescription: initialValues?.seoDescription ?? "",
      ogImage: initialValues?.ogImage ?? ""
    }),
    [content, initialValues, locale]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues
  });

  const slug = watch("slug");

  async function onSubmit(values: PostFormValues) {
    setIsSubmitting(true);
    setMessage(null);
    const payload = { ...values, content };
    const result = postId
      ? await updatePostAction(postId, payload)
      : await createPostAction(payload);

    setMessage(result.message);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <input type="hidden" {...register("locale")} value={locale} />
      <section className="grid gap-5 rounded-lg border border-border bg-white p-5">
        <div className="grid gap-2">
          <Label htmlFor="title">{labels.title}</Label>
          <Input id="title" {...register("title")} />
          {errors.title ? <FieldError message={errors.title.message} /> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">{labels.slug}</Label>
          <div className="flex gap-2">
            <Input id="slug" {...register("slug")} />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setValue("slug", slugify(watch("title")))}
            >
              Generate
            </Button>
          </div>
          {errors.slug ? <FieldError message={errors.slug.message} /> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">{labels.description}</Label>
          <Textarea id="description" {...register("description")} />
          {errors.description ? <FieldError message={errors.description.message} /> : null}
        </div>
      </section>

      <section className="grid gap-3 rounded-lg border border-border bg-white p-5">
        <Label>Content</Label>
        <RichTextEditor
          value={content}
          onChange={(nextContent) => {
            setContent(nextContent);
            setValue("content", nextContent, { shouldValidate: true });
          }}
        />
      </section>

      <section className="grid gap-5 rounded-lg border border-border bg-white p-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="coverImage">{labels.coverImage}</Label>
          <Input id="coverImage" {...register("coverImage")} placeholder="/images/public-dialogue.png" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ogImage">{labels.ogImage}</Label>
          <Input id="ogImage" {...register("ogImage")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">{labels.status}</Label>
          <select
            id="status"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            {...register("status")}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="commentMode">{labels.commentMode}</Label>
          <select
            id="commentMode"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            {...register("commentMode")}
          >
            <option value="disabled">Disabled</option>
            <option value="anonymous">Anonymous</option>
            <option value="authenticated">Authenticated</option>
          </select>
        </div>
      </section>

      <section className="grid gap-5 rounded-lg border border-border bg-white p-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="seoTitle">{labels.seoTitle}</Label>
          <Input id="seoTitle" {...register("seoTitle")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="seoDescription">{labels.seoDescription}</Label>
          <Textarea id="seoDescription" {...register("seoDescription")} />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setValue("status", "draft")}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {labels.saveDraft}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setValue("status", "published")}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {labels.publish}
        </Button>
        {slug ? (
          <Button asChild variant="secondary">
            <Link href={`/${locale}/news/${slug}`} target="_blank">
              <Eye className="h-4 w-4" aria-hidden="true" />
              {labels.preview}
            </Link>
          </Button>
        ) : null}
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}
