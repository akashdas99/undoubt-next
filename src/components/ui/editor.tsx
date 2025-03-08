"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import EditorToolBar from "./editorToolbar";
import { cn } from "@/lib/utils";

type EditorProps = {
  content: string;
  onChange: (e: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Editor = ({ className, content, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),

      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[156px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getText() ? editor.getHTML() : "");
    },
  });
  return (
    <>
      <EditorToolBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default Editor;
