"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Undo, Redo } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const MenuButton = ({
  onClick,
  isActive,
  disabled,
  children,
}: MenuButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer",
      isActive && "bg-white text-black hover:bg-neutral-200 hover:text-black"
    )}
  >
    {children}
  </button>
);

export default function TiptapEditor({ value, onChange, disabled }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[250px] max-h-[500px] overflow-y-auto w-full rounded-b-lg border border-slate-800 bg-slate-950/40 p-4 text-xs font-light leading-relaxed text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-neutral-400/20 focus:border-neutral-400 transition-all font-sans prose prose-invert max-w-none"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor synced with external value updates
  React.useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Keep editor editable state synced
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full flex flex-col border border-slate-800 rounded-lg overflow-hidden bg-slate-900/40">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 border-b border-slate-800 shrink-0">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          disabled={disabled}
        >
          <Bold className="w-3.5 h-3.5" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          disabled={disabled}
        >
          <Italic className="w-3.5 h-3.5" />
        </MenuButton>

        <div className="w-px h-4 bg-slate-800 mx-1 shrink-0"></div>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          disabled={disabled}
        >
          <Heading1 className="w-3.5 h-3.5" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
        >
          <Heading2 className="w-3.5 h-3.5" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
        >
          <Heading3 className="w-3.5 h-3.5" />
        </MenuButton>

        <div className="w-px h-4 bg-slate-800 mx-1 shrink-0"></div>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          disabled={disabled}
        >
          <List className="w-3.5 h-3.5" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          disabled={disabled}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          disabled={disabled}
        >
          <Quote className="w-3.5 h-3.5" />
        </MenuButton>

        <div className="w-px h-4 bg-slate-800 mx-1 shrink-0"></div>

        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={disabled}>
          <Undo className="w-3.5 h-3.5" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={disabled}>
          <Redo className="w-3.5 h-3.5" />
        </MenuButton>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
