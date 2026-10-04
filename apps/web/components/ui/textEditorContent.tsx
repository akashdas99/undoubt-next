"use client";

import { cn } from "@/lib/utils";
import parse from "html-react-parser";

type TextEditorContentProps = {
  content: string;
  className?: string;
};

const TextEditorContent = ({ content, className }: TextEditorContentProps) => {
  return <div className={cn("typeset", className)}>{parse(content)}</div>;
};

export default TextEditorContent;
