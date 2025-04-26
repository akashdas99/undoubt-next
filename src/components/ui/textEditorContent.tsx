"use client";
import useTiptapEditor from "@/hooks/useTiptapEditor";
import { EditorContent } from "@tiptap/react";
import React from "react";

const TextEditorContent = ({ content }: { content: string }) => {
  const editor = useTiptapEditor({
    content: content,
    editable: false,
    className: "border-0 min-h-auto p-0",
  });
  return <EditorContent editor={editor} />;
};

export default TextEditorContent;
