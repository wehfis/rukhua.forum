import type { Locale } from "@/i18n/routing";

export type PostStatus = "draft" | "published";
export type CommentMode = "disabled" | "anonymous" | "authenticated";

export type RichTextMark = {
  type: "bold" | "italic" | "underline" | "link";
  attrs?: {
    href?: string;
    target?: string;
    rel?: string;
  };
};

export type RichTextNode = {
  type:
    | "doc"
    | "paragraph"
    | "text"
    | "heading"
    | "blockquote"
    | "bulletList"
    | "orderedList"
    | "listItem"
    | "horizontalRule"
    | "image";
  text?: string;
  attrs?: {
    level?: number;
    src?: string;
    alt?: string;
    title?: string;
  };
  marks?: RichTextMark[];
  content?: RichTextNode[];
};

export type RichTextDocument = {
  type: "doc";
  content: RichTextNode[];
};

export type PublishedPost = {
  id: string;
  locale: Locale;
  title: string;
  slug: string;
  description: string;
  content: RichTextDocument;
  coverImage: string;
  status: PostStatus;
  commentMode: CommentMode;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  likeCount: number;
  commentCount: number;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};
