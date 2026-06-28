"use client";

import { useActionState } from "react";
import { MessageCircle } from "lucide-react";
import { submitCommentAction } from "@/features/comments/actions";
import type { CommentMode } from "@/features/posts/types";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CommentSection({
  postId,
  slug,
  locale,
  mode,
  labels
}: {
  postId: string;
  slug: string;
  locale: Locale;
  mode: CommentMode;
  labels: {
    title: string;
    placeholder: string;
    name: string;
    submit: string;
    disabled: string;
    authRequired: string;
  };
}) {
  const action = submitCommentAction.bind(null, { postId, slug, locale });
  const [state, formAction, isPending] = useActionState(action, null);

  if (mode === "disabled") {
    return (
      <section className="border-t border-border pt-8">
        <h2 className="flex items-center gap-2 font-serif text-3xl">
          <MessageCircle className="h-5 w-5" />
          {labels.title}
        </h2>
        <p className="mt-4 text-muted-foreground">{labels.disabled}</p>
      </section>
    );
  }

  if (mode === "authenticated") {
    return (
      <section className="border-t border-border pt-8">
        <h2 className="flex items-center gap-2 font-serif text-3xl">
          <MessageCircle className="h-5 w-5" />
          {labels.title}
        </h2>
        <p className="mt-4 text-muted-foreground">{labels.authRequired}</p>
      </section>
    );
  }

  return (
    <section className="border-t border-border pt-8">
      <h2 className="flex items-center gap-2 font-serif text-3xl">
        <MessageCircle className="h-5 w-5" />
        {labels.title}
      </h2>
      <form action={formAction} className="mt-6 space-y-4">
        <Input name="anonymousName" placeholder={labels.name} />
        <Textarea name="content" required placeholder={labels.placeholder} />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {labels.submit}
          </Button>
          {state?.message ? (
            <p
              className={
                state.ok
                  ? "text-sm text-muted-foreground"
                  : "text-sm text-destructive"
              }
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
