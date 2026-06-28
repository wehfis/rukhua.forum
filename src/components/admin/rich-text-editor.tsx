"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading1,
  Heading2,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  UnderlineIcon
} from "lucide-react";
import type { RichTextDocument } from "@/features/posts/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const toolbarGroups = [
  [
    { label: "Heading 1", icon: Heading1, action: "heading1" },
    { label: "Heading 2", icon: Heading2, action: "heading2" }
  ],
  [
    { label: "Bold", icon: Bold, action: "bold" },
    { label: "Italic", icon: Italic, action: "italic" },
    { label: "Underline", icon: UnderlineIcon, action: "underline" }
  ],
  [
    { label: "Bulleted list", icon: List, action: "bulletList" },
    { label: "Ordered list", icon: ListOrdered, action: "orderedList" },
    { label: "Quote", icon: Quote, action: "blockquote" }
  ],
  [
    { label: "Link", icon: LinkIcon, action: "link" },
    { label: "Image", icon: ImageIcon, action: "image" },
    { label: "Horizontal rule", icon: Minus, action: "horizontalRule" }
  ]
] as const;

export function RichTextEditor({
  value,
  onChange
}: {
  value: RichTextDocument;
  onChange: (value: RichTextDocument) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true
      }),
      Image,
      Placeholder.configure({
        placeholder: "Write article content..."
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[340px] px-4 py-4 outline-none prose prose-neutral max-w-none"
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as RichTextDocument);
    }
  });

  function runAction(action: string) {
    if (!editor) {
      return;
    }

    if (action === "heading1") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    }

    if (action === "heading2") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }

    if (action === "bold") {
      editor.chain().focus().toggleBold().run();
    }

    if (action === "italic") {
      editor.chain().focus().toggleItalic().run();
    }

    if (action === "underline") {
      editor.chain().focus().toggleUnderline().run();
    }

    if (action === "bulletList") {
      editor.chain().focus().toggleBulletList().run();
    }

    if (action === "orderedList") {
      editor.chain().focus().toggleOrderedList().run();
    }

    if (action === "blockquote") {
      editor.chain().focus().toggleBlockquote().run();
    }

    if (action === "horizontalRule") {
      editor.chain().focus().setHorizontalRule().run();
    }

    if (action === "link") {
      const href = window.prompt("URL");

      if (href) {
        editor.chain().focus().setLink({ href }).run();
      }
    }

    if (action === "image") {
      const src = window.prompt("Image URL");

      if (src) {
        editor.chain().focus().setImage({ src }).run();
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-background">
      <div className="flex flex-wrap gap-1 border-b border-border bg-muted p-2">
        {toolbarGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex gap-1 border-r border-border pr-1 last:border-r-0">
            {group.map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  key={item.action}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("h-9 w-9", editor?.isActive(item.action) && "bg-background")}
                  title={item.label}
                  aria-label={item.label}
                  onClick={() => runAction(item.action)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
