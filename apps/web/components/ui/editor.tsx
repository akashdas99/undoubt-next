"use client";

import useTiptapEditor from "@/hooks/useTiptapEditor";
import { EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import EditorToolBar from "./editorToolbar";

type EditorProps = {
  content: string;
  onChange: (e: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Editor = ({ className, content, onChange }: EditorProps) => {
  const editor = useTiptapEditor({
    content,
    className,
    onChange,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getText() ? editor.getHTML() : "";
    if (content !== current)
      editor.commands.setContent(content, { emitUpdate: false });
  }, [editor, content]);

  return (
    <>
      <EditorToolBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default Editor;
