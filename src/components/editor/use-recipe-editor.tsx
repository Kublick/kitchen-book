import { useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

type Props = {
  content?: string;
};

export function useRecipeEditor({ content }: Props) {
  const editor = useEditor({
    content,
    editorProps: {
      attributes: {
        class:
          "min-h-[6.5rem] p-2 prose prose-p:my-4 prose-li:m-0 prose-li:p-0 outline-none",
      },
    },
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            className: "leading-5",
          },
        },
        heading: {
          HTMLAttributes: {
            className: "text-2xl",
          },
        },
        orderedList: {
          HTMLAttributes: {
            className: "list-decimal list-outside ml-8 ",
          },
        },
        bulletList: {
          HTMLAttributes: { className: "list-disc list-outside ml-8" },
        },
        blockquote: {
          HTMLAttributes: {
            className: "border-l-4 border-grey-600 pl-4 italic",
          },
        },
      }),
    ],
  });
  const isEmpty = (editor?.getText() ?? "").trim().length === 0;
  return { editor, isEmpty };
}
