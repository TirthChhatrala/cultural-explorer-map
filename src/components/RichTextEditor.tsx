import React, { useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Undo, Redo, Image as ImgIcon,
  Link as LinkIcon, Table as TableIcon, Youtube as YtIcon,
  Palette, Highlighter,
} from "lucide-react";
import { uploadStoryImage } from "@/lib/stories";
import { toast } from "@/hooks/use-toast";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  textColor?: string;
  bgColor?: string;
}

const ToolbarButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}> = ({ onClick, active, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-2 rounded-md hover:bg-muted transition-colors ${active ? "bg-india-orange/15 text-india-orange" : ""}`}
  >
    {children}
  </button>
);

const RichTextEditor: React.FC<Props> = ({ value, onChange, placeholder, textColor, bgColor }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-india-orange underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg my-3 max-w-full" } }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      TextStyle, Color, Highlight.configure({ multicolor: true }),
      Youtube.configure({ controls: true, nocookie: true, HTMLAttributes: { class: "rounded-lg my-3 w-full aspect-video" } }),
      Placeholder.configure({ placeholder: placeholder || "Start writing your story..." }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4",
      },
    },
  });

  const addImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      try {
        toast({ title: "Uploading image..." });
        const url = await uploadStoryImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (e: any) {
        toast({ title: "Upload failed", description: e.message, variant: "destructive" });
      }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt("Enter URL");
    if (!url || !editor) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt("YouTube URL");
    if (!url || !editor) return;
    editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-input p-2 bg-muted/40">
        <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold size={16} /></ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic size={16} /></ToolbarButton>
        <ToolbarButton title="Strike" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}><Strikethrough size={16} /></ToolbarButton>
        <span className="w-px h-6 bg-border mx-1" />
        <ToolbarButton title="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}><Heading1 size={16} /></ToolbarButton>
        <ToolbarButton title="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 size={16} /></ToolbarButton>
        <ToolbarButton title="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 size={16} /></ToolbarButton>
        <span className="w-px h-6 bg-border mx-1" />
        <ToolbarButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List size={16} /></ToolbarButton>
        <ToolbarButton title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered size={16} /></ToolbarButton>
        <ToolbarButton title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote size={16} /></ToolbarButton>
        <ToolbarButton title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}><Code size={16} /></ToolbarButton>
        <span className="w-px h-6 bg-border mx-1" />
        <ToolbarButton title="Link" onClick={addLink} active={editor.isActive("link")}><LinkIcon size={16} /></ToolbarButton>
        <ToolbarButton title="Upload Image" onClick={addImage}><ImgIcon size={16} /></ToolbarButton>
        <ToolbarButton title="Embed YouTube" onClick={addYoutube}><YtIcon size={16} /></ToolbarButton>
        <ToolbarButton title="Insert Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16} /></ToolbarButton>
        <span className="w-px h-6 bg-border mx-1" />
        <label className="p-2 rounded-md hover:bg-muted cursor-pointer flex items-center" title="Text color">
          <Palette size={16} />
          <input
            type="color"
            className="sr-only"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
        <label className="p-2 rounded-md hover:bg-muted cursor-pointer flex items-center" title="Highlight">
          <Highlighter size={16} />
          <input
            type="color"
            className="sr-only"
            onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
          />
        </label>
        <span className="w-px h-6 bg-border mx-1" />
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo size={16} /></ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo size={16} /></ToolbarButton>
      </div>
      <div style={{ color: textColor || undefined, background: bgColor || undefined }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;