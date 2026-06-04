"use client";

import { Bold, Italic, Strikethrough, Heading1, Heading2, Quote, List, Undo, Redo, MoreHorizontal } from "lucide-react";
import { type Editor } from "@tiptap/react"; 

interface EditorToolbarProps {
  editor: Editor | null;
  className?: string; 
}

export default function EditorToolbar({ editor, className = "" }: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className={`flex items-center gap-1 p-1.5 border border-border/50 bg-secondary/30 rounded-xl w-fit backdrop-blur-sm shadow-sm transition-all ${className}`}>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} icon={<Bold className="w-4 h-4" />} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} icon={<Italic className="w-4 h-4" />} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} icon={<Strikethrough className="w-4 h-4" />} />
      
      <div className="w-px h-4 bg-border/50 mx-1"></div>
      
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} icon={<Heading1 className="w-4 h-4" />} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} icon={<Heading2 className="w-4 h-4" />} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} icon={<Quote className="w-4 h-4" />} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} icon={<List className="w-4 h-4" />} />
      
      {/* 🟢 NEW: Scene Break Button */}
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} icon={<MoreHorizontal className="w-4 h-4" />} />

      <div className="w-px h-4 bg-border/50 mx-1"></div>

      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} isActive={false} icon={<Undo className="w-4 h-4" />} />
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} isActive={false} icon={<Redo className="w-4 h-4" />} />
    </div>
  );
}

function ToolbarButton({ onClick, isActive, icon }: { onClick: () => void, isActive: boolean, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
    </button>
  );
}