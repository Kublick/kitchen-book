import type { Editor } from "@tiptap/react";
import {
  Bold,
  Heading,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Undo,
} from "lucide-react";

type Props = {
  children?: React.ReactNode;
  editor: Editor | null;
};

export const EditorToolbar = ({ children, editor }: Props) => {
  if (!editor) return null;
  const styles = "p-0.5 rounded-full transition-colors";
  return (
    <div className="flex items-center gap-x-1 p-2" role="toolbar">
      <button
        type="button"
        className={`${styles} ${
          editor.isActive("heading", { level: 3 })
            ? "bg-black/10"
            : "bg-transparent"
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Encabezado"
      >
        <Heading size="20" />
      </button>
      <button
        type="button"
        className={`${styles} ${
          editor.isActive("bold") ? "bg-black/10" : "bg-transparent"
        }`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        // disabled={!editor.can().chain().focus().toggleBold().run()}
        title="Negrita"
      >
        <Bold size="20" />
      </button>
      <button
        type="button"
        className={`${styles} ${
          editor.isActive("italic") ? "bg-black/10" : "bg-transparent"
        }`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        // disabled={!editor.can().chain().focus().toggleItalic().run()}
        title="Cursiva"
      >
        <Italic size="20" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${styles} ${
          editor.isActive("bulletList") ? "bg-black/10" : "bg-transparent"
        }`}
        title="Lista de viñetas"
      >
        <List size="20" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${styles} ${
          editor.isActive("orderedList") ? "bg-black/10" : "bg-transparent"
        }`}
        title="Lista numerada"
      >
        <ListOrdered size="20" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <Quote size="20" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size="20" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo size="20" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo size="20" />
      </button>
      {children}
    </div>
  );
};
