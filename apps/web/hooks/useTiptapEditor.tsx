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
          "w-full rounded-md border border-input bg-transparent px-sm py-xxs text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
