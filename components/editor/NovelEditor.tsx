"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import BubbleToolbar from "./BubbleToolbar";
import EditorTitleInput from "./EditorTitleInput";
import { useEditorContext } from "@/app/(editor)/project/[id]/write/EditorContext";

const EXTENSIONS = [
  StarterKit,
  Underline,
  Placeholder.configure({ placeholder: "Start writing..." }),
  CharacterCount, 
];

export default function NovelEditor() {
  // 🟢 Pull directly from the cloud!
  const { activeChapter: chapter, handleAutoSave, saveStatus } = useEditorContext();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const loadedChapterIdRef = useRef<string | null>(null);

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
        handleAutoSave({ 
          content: ed.getJSON(),
          wordCount: ed.storage.characterCount.words() 
        });
      }, 2000);
    },
  });

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (editor && chapter && loadedChapterIdRef.current !== chapter._id) {
      editor.commands.setContent(chapter.content || "");
      loadedChapterIdRef.current = chapter._id;
    }
  }, [chapter, editor]); 

  if (!chapter) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
         <span>{saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : ""}</span>
      </div>

      <EditorTitleInput
        key={chapter._id} 
        initialTitle={chapter.title || ""}
        onAutoSave={(title) => handleAutoSave({ title })}
      />
      
      <div className="relative mt-8">
        {editor && <BubbleToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}