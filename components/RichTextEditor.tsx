"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

export type RichTextEditorHandle = {
  focusAtStart: () => void;
  focusAtEnd: () => void;
};

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor({ value, onChange, placeholder = "", onFocus, onBlur }, ref) {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          protocols: ["http", "https"],
        }),
        Placeholder.configure({
          placeholder,
        }),
      ],
      content: value,
      editorProps: {
        attributes: {
          class:
            "min-h-[220px] w-full rounded-md bg-transparent px-0 py-2 text-[16px] leading-7 text-gray-900 dark:text-gray-300 outline-none prose prose-neutral dark:prose-invert max-w-none",
        },
      },
      onUpdate: ({ editor: current }) => {
        onChange(current.getHTML());
      },
      onFocus: () => onFocus?.(),
      onBlur: () => onBlur?.(),
    });

    useImperativeHandle(ref, () => ({
      focusAtStart: () => {
        editor?.commands.focus("start");
      },
      focusAtEnd: () => {
        editor?.commands.focus("end");
      },
    }), [editor]);

    useEffect(() => {
      if (!editor) return;
      const current = editor.getHTML();
      if (current !== value) {
        editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
      }
    }, [editor, value]);

    if (!editor) return null;

    const toggleLink = () => {
      const existing = editor.getAttributes("link").href as string | undefined;
      const next = window.prompt("URL do link", existing || "https://");
      if (next === null) return;
      if (next.trim() === "") {
        editor.chain().focus().unsetLink().run();
        return;
      }
      editor.chain().focus().setLink({ href: next.trim() }).run();
    };

    const buttonClass = "p-1.5 rounded-md border border-transparent hover:border-[#383836] hover:bg-[#fffff315] text-[#7d7a75] hover:text-[#f0efed] transition-colors";
    const activeClass = "border-[#383836] bg-[#fffff315] text-[#f0efed]";

    return (
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${buttonClass} ${editor.isActive("heading", { level: 1 }) ? activeClass : ""}`}
            aria-label="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${buttonClass} ${editor.isActive("heading", { level: 2 }) ? activeClass : ""}`}
            aria-label="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`${buttonClass} ${editor.isActive("heading", { level: 3 }) ? activeClass : ""}`}
            aria-label="Heading 3"
          >
            <Heading3 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${buttonClass} ${editor.isActive("bold") ? activeClass : ""}`}
            aria-label="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${buttonClass} ${editor.isActive("italic") ? activeClass : ""}`}
            aria-label="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${buttonClass} ${editor.isActive("bulletList") ? activeClass : ""}`}
            aria-label="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${buttonClass} ${editor.isActive("orderedList") ? activeClass : ""}`}
            aria-label="Ordered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${buttonClass} ${editor.isActive("blockquote") ? activeClass : ""}`}
            aria-label="Blockquote"
          >
            <Quote size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`${buttonClass} ${editor.isActive("codeBlock") ? activeClass : ""}`}
            aria-label="Code block"
          >
            <Code2 size={16} />
          </button>
          <button
            type="button"
            onClick={toggleLink}
            className={`${buttonClass} ${editor.isActive("link") ? activeClass : ""}`}
            aria-label="Link"
          >
            <Link2 size={16} />
          </button>
        </div>

        <EditorContent editor={editor} />
      </div>
    );
  }
);
