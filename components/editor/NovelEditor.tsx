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
  } = useEditorContext();

  // Refs for debounce timers and tracking the currently loaded document
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const loadedChapterIdRef = useRef<string | null>(null);

  // The Live Mirror: Ensures Tiptap always calls the most recent save function
  const autoSaveRef = useRef(handleAutoSave);

  useEffect(() => {
    autoSaveRef.current = handleAutoSave;
  }, [handleAutoSave]);

  // Initialize the Tiptap editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: EXTENSIONS,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[500px] text-foreground prose-p:leading-relaxed prose-headings:font-serif",
      },
    },
    onUpdate: ({ editor: ed }) => {
      // Clear the previous timer if the user keeps typing
      if (debounceRef.current) clearTimeout(debounceRef.current);

      // Wait 2 seconds after typing stops before triggering the network request
      debounceRef.current = setTimeout(() => {
        autoSaveRef.current({
          content: ed.getJSON(),
          wordCount: ed.storage.characterCount.words(),
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
      const hasText =
        typeof chapter.content === "string"
          ? chapter.content.length > 0
          : Object.keys(chapter.content).length > 0;

      if (hasText) {
        editor.commands.setContent(chapter.content);
      }
    }
  }, [chapter, editor]);

  // Do not render the editor UI if no chapter data exists yet
  if (!chapter) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "saved"
              ? "Saved"
              : ""}
        </span>
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