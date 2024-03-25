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
          "min-h-[4.5rem] p-2 prose prose-p:my-4 prose-li:m-0 prose-li:p-0 outline-none",
      },
    },
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "leading-5",
          },
        },
        heading: {
          HTMLAttributes: {
            class: "text-2xl",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: " list-decimal list-outside ml-8 ",
          },
        },
        bulletList: {
          HTMLAttributes: { class: "list-disc list-outside ml-8" },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-grey-600 pl-4 italic",
          },
        },
      }),
    ],
  });
  const isEmpty = (editor?.getText() ?? "").trim().length === 0;
  return { editor, isEmpty };
}
