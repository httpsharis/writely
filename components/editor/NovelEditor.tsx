"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import BubbleToolbar from "./BubbleToolbar";
import { type Document } from "@/redux/features/documents/documentApi";
import EditorTitleInput from "./EditorTitleInput";

export type SaveStatus = "saved" | "saving" | "off";

interface Props {
  chapter: Document | null;
  onAutoSave: (data: Partial<Document>) => Promise<void>;
  saveStatus: SaveStatus;
}

const EXTENSIONS = [
  StarterKit,
  Underline,
  Placeholder.configure({ placeholder: "Start writing..." }),
];

export default function NovelEditor({ chapter, onAutoSave, saveStatus }: Props) {
  // Correctly type the timeout so it clears cleanly in browser environments
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: EXTENSIONS,
    editorProps: {
      attributes: {
        class: "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[500px] text-foreground prose-p:leading-relaxed prose-headings:font-serif",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onAutoSave({ content: ed.getJSON() });
      }, 2000);
    },
  });

  // Cleanup timeout when editor unmounts
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Safely inject initial content without resetting the cursor
  useEffect(() => {
    if (editor && chapter) {
      editor.commands.setContent(chapter.content || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?._id, editor]); 

  // The empty state is now perfectly handled by WritePage
  if (!chapter) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
         <span>{saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : ""}</span>
      </div>

      <EditorTitleInput
        key={chapter._id} 
        initialTitle={chapter.title || ""}
        onAutoSave={(title) => onAutoSave({ title })}
      />
      
      <div className="relative mt-8">
        {editor && <BubbleToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}