"use client";
import parse from "html-react-parser";

const TextEditorContent = ({ content }: { content: string }) => {
  return parse(content);
};

export default TextEditorContent;
