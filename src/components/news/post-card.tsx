import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { PublishedPost } from "@/features/posts/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PostCard({
  post,
  locale,
  readMoreLabel,
  likesLabel,
  commentsLabel
}: {
  post: PublishedPost;
  locale: Locale;
  readMoreLabel: string;
  likesLabel: string;
  commentsLabel: string;
}) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/${locale}/news/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-muted">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <time className="text-xs font-semibold uppercase text-muted-foreground">
          {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
            new Date(post.publishedAt)
          )}
        </time>
        <div>
          <h2 className="font-serif text-2xl leading-tight">
            <Link href={`/${locale}/news/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {post.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              {post.likeCount} {likesLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {post.commentCount} {commentsLabel}
            </span>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href={`/${locale}/news/${post.slug}`}>{readMoreLabel}</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
