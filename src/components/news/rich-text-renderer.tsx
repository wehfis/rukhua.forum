import type { ReactNode } from "react";
import type { RichTextDocument, RichTextMark, RichTextNode } from "@/features/posts/types";

function renderMarks(node: RichTextNode, key: string) {
  let value: ReactNode = node.text ?? "";

  for (const mark of node.marks ?? []) {
    value = applyMark(mark, value, key);
  }

  return value;
}

function applyMark(mark: RichTextMark, children: ReactNode, key: string) {
  if (mark.type === "bold") {
    return <strong key={`${key}-bold`}>{children}</strong>;
  }

  if (mark.type === "italic") {
    return <em key={`${key}-italic`}>{children}</em>;
  }

  if (mark.type === "underline") {
    return <u key={`${key}-underline`}>{children}</u>;
  }

  if (mark.type === "link") {
    return (
      <a
        key={`${key}-link`}
        href={mark.attrs?.href ?? "#"}
        rel={mark.attrs?.rel ?? "noreferrer"}
        target={mark.attrs?.target ?? "_blank"}
      >
        {children}
      </a>
    );
  }

  return children;
}

function renderChildren(node: RichTextNode, key: string) {
  return node.content?.map((child, index) => renderNode(child, `${key}-${index}`));
}

function renderNode(node: RichTextNode, key: string): ReactNode {
  if (node.type === "text") {
    return <span key={key}>{renderMarks(node, key)}</span>;
  }

  if (node.type === "paragraph") {
    return <p key={key}>{renderChildren(node, key)}</p>;
  }

  if (node.type === "heading") {
    const level = node.attrs?.level === 3 ? 3 : 2;

    return level === 3 ? (
      <h3 key={key}>{renderChildren(node, key)}</h3>
    ) : (
      <h2 key={key}>{renderChildren(node, key)}</h2>
    );
  }

  if (node.type === "blockquote") {
    return <blockquote key={key}>{renderChildren(node, key)}</blockquote>;
  }

  if (node.type === "bulletList") {
    return <ul key={key}>{renderChildren(node, key)}</ul>;
  }

  if (node.type === "orderedList") {
    return <ol key={key}>{renderChildren(node, key)}</ol>;
  }

  if (node.type === "listItem") {
    return <li key={key}>{renderChildren(node, key)}</li>;
  }

  if (node.type === "horizontalRule") {
    return <hr key={key} />;
  }

  if (node.type === "image" && node.attrs?.src) {
    return (
      <figure key={key} className="my-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={node.attrs.src}
          alt={node.attrs.alt ?? ""}
          className="aspect-[16/9] w-full rounded-md border border-border object-cover"
        />
        {node.attrs.title ? (
          <figcaption className="mt-3 text-sm text-muted-foreground">
            {node.attrs.title}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return null;
}

export function RichTextRenderer({ content }: { content: RichTextDocument }) {
  return (
    <div className="editorial-prose">
      {content.content.map((node, index) => renderNode(node, `node-${index}`))}
    </div>
  );
}
