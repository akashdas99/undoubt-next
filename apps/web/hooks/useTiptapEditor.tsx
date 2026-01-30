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
            class: "bg-foreground text-white p-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
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
          class: "list-disc ml-3",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          "w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
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
