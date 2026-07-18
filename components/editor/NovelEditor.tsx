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
  // Pull necessary state and functions from the Editor Provider
  const {
    activeChapter: chapter,
    handleAutoSave,
    saveStatus,
    setLiveWordCount,
  } = useEditorContext();

  // Refs for debounce timers and tracking the currently loaded document
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const loadedChapterIdRef = useRef<string | null>(null);

  // The Live Mirror: Ensures Tiptap always calls the most recent save function
  const autoSaveRef = useRef(handleAutoSave);

  useEffect(() => {
    autoSaveRef.current = handleAutoSave;
  }, [handleAutoSave]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: EXTENSIONS,
    editorProps: {
      attributes: {
        class: "font-['Fraunces'] text-[19px] leading-[1.75] text-editor-text-primary outline-none min-h-[300px] whitespace-pre-wrap [&_p]:mb-[1.2em]",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const words = ed.storage.characterCount.words();
      
      // Instantly update the UI
      setLiveWordCount(words);

      // Clear the previous timer if the user keeps typing
      if (debounceRef.current) clearTimeout(debounceRef.current);

      // Wait 2 seconds after typing stops before triggering the network request
      debounceRef.current = setTimeout(() => {
        autoSaveRef.current({
          content: ed.getJSON(),
          wordCount: words,
        });
      }, 2000);
    },
  });

  // Cleanup the debounce timer if the component unmounts
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Safe content injection: Prevents cursor jumping and race conditions
  useEffect(() => {
    if (!editor || !chapter) return;

    // Condition A: The user clicked a completely different chapter in the sidebar
    if (loadedChapterIdRef.current !== chapter._id) {
      editor.commands.setContent(chapter.content || "");
      loadedChapterIdRef.current = chapter._id;
    }
    // Condition B: The backend just finished fetching text for the current blank screen
    else if (editor.isEmpty && chapter.content) {
      const hasText = Object.keys(chapter.content).length > 0;

      if (hasText) {
        editor.commands.setContent(chapter.content);
      }
    }
  }, [chapter, editor]);

  // Do not render the editor UI if no chapter data exists yet
  if (!chapter) return null;

  return (
    <div className="overflow-y-auto flex justify-center py-16 px-8 h-full w-full">
      <div className="w-full max-w-[680px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-[2px] p-1 rounded-lg border border-editor-border bg-editor-surface">
            <button onClick={() => editor?.chain().focus().toggleBold().run()} className="w-7 h-7 flex items-center justify-center border-none bg-transparent rounded-[5px] text-editor-text-secondary text-[13px] transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary font-bold">B</button>
            <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="w-7 h-7 flex items-center justify-center border-none bg-transparent rounded-[5px] text-editor-text-secondary text-[13px] transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary italic font-['Fraunces']">i</button>
            <div className="w-px h-4 bg-editor-border-strong mx-1"></div>
            <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="w-7 h-7 flex items-center justify-center border-none bg-transparent rounded-[5px] text-editor-text-secondary text-[13px] transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary font-bold">H</button>
            <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className="w-7 h-7 flex items-center justify-center border-none bg-transparent rounded-[5px] text-editor-text-secondary text-[13px] transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary font-serif">&rdquo;</button>
          </div>
          <span className="text-[12px] text-editor-text-tertiary font-['JetBrains_Mono']">Chapter {chapter.order || 1} · no target set</span>
        </div>

        <EditorTitleInput
          key={chapter._id}
          initialTitle={chapter.title || ""}
          onAutoSave={(title) => handleAutoSave({ title })}
        />

        <div className="relative">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}