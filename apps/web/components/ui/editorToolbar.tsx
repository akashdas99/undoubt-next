"use client";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { Toggle } from "@workspace/ui/components/toggle";

type EditorToolBarProps = {
  editor: Editor | null;
};

export default function EditorToolBar({ editor }: EditorToolBarProps) {
  if (!editor) return null;

  const Options = [
    {
      icon: <Bold className="size-md" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-md" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-md" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-md" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-md" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-md" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="size-md" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-md" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
    },
    {
      icon: <Code className="size-md" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      preesed: editor.isActive("code"),
    },
  ];

  return (
    <div className="sticky top-2xl z-50 mb-xxs w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-full border border-field-border bg-input/50 text-foreground">
      <div className="flex w-max flex-nowrap items-center gap-xxs p-xs">
        {Options.map((option, i) => (
          <Toggle
            key={i}
            size="sm"
            pressed={option.preesed}
            onPressedChange={option.onClick}
            className="size-xl min-w-xl shrink-0 p-0"
          >
            {option.icon}
          </Toggle>
        ))}
      </div>
    </div>
  );
}
