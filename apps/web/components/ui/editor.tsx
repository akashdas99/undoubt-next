"use client";

import useTiptapEditor, { editorHtml } from "@/hooks/useTiptapEditor";
import { EditorContent } from "@tiptap/react";
import { useEffect, useRef } from "react";
import "./editor.module.css";
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
  const seenContentRef = useRef(content);

  useEffect(() => {
    if (!editor) return;
    const current = editorHtml(editor);
    if (content === current) {
      seenContentRef.current = content;
      return;
    }
    // Same prop as last time: this run is an editor update (image insert),
    // not an external change such as form.reset().
    if (content === seenContentRef.current) return;
    seenContentRef.current = content;
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
