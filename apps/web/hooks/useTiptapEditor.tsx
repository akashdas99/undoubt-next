import { cn } from "@/lib/utils";
import { BulletList } from "@tiptap/extension-list";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
type EditorProps = {
  className?: string;
  onChange?: (text: string) => void;
  content: string;
  editable?: boolean;
};
const useTiptapEditor = ({
  className,
  onChange,
  content,
  editable,
}: EditorProps) =>
  useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: "bg-foreground p-xs text-white",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "ml-sm list-decimal",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),

      BulletList.configure({
        HTMLAttributes: {
          class: "ml-sm list-disc",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[calc(var(--spacing-3xl)*4)] w-full rounded-4xl border border-field-border bg-input/50 px-xl py-md text-base leading-normal transition-[color,box-shadow,background-color] outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 md:text-sm",
          className
        ),
      },
    },
    immediatelyRender: false,
    editable: editable,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getText() ? editor.getHTML() : "");
    },
  });

export default useTiptapEditor;
