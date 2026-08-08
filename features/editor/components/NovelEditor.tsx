"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import BubbleToolbar from "../../../components/editor/BubbleToolbar";
import EditorTitleInput from "../../../components/editor/EditorTitleInput";
import { useEditorContext } from "@/features/editor/context/EditorContext";
import { CharacterMention, getSuggestionOptions } from "./extensions/CharacterMention";
import { CharacterHoverCard } from "../../../components/shared/CharacterHoverCard";
import { useGetNovelCharactersQuery } from "@/redux/features/characters/characterApi";

const BASE_EXTENSIONS = [
  StarterKit,
  Underline,
  Placeholder.configure({ placeholder: "Start writing..." }),
  CharacterCount,
];

export default function NovelEditor() {
  // Pull necessary state and functions from the Editor Provider
  const {
    novel,
    activeChapter: chapter,
    handleAutoSave,
    saveStatus,
    setLiveWordCount,
  } = useEditorContext();

  // Refs for debounce timers and tracking the currently loaded document
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const loadedChapterIdRef = useRef<string | null>(null);

  const { data } = useGetNovelCharactersQuery(novel?._id ?? "", {
    skip: !novel?._id,
  });
  const characters = data?.characters || [];
  const charactersRef = useRef(characters);

  useEffect(() => {
    charactersRef.current = characters;
  }, [characters]);

  // The Live Mirror: Ensures Tiptap always calls the most recent save function
  const autoSaveRef = useRef(handleAutoSave);
  const latestDataRef = useRef({
    content: chapter?.content,
    words: chapter?.wordCount || 0,
  });

  useEffect(() => {
    autoSaveRef.current = handleAutoSave;
  }, [handleAutoSave]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      ...BASE_EXTENSIONS,
      CharacterMention.configure({
        HTMLAttributes: {
          class: 'character-mention',
        },
        suggestion: getSuggestionOptions(() => charactersRef.current),
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "font-['Fraunces'] text-[19px] leading-[1.75] text-editor-text-primary outline-none min-h-[300px] whitespace-pre-wrap [&_p]:mb-[1.2em]",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const words = ed.storage.characterCount.words();
      const content = ed.getJSON();

      setLiveWordCount(words);
      latestDataRef.current = { content, words }; // Always strictly up to date

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        autoSaveRef.current({ content, wordCount: words });
        debounceRef.current = undefined; // Clear it out when done
      }, 2000);
    },
  });

  // 2. The Fail-Safe Unmount
  useEffect(() => {
    return () => {
      // If there is a pending save when they hit the Back button, fire it instantly!
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        autoSaveRef.current({
          content: latestDataRef.current.content,
          wordCount: latestDataRef.current.words,
        });
      }
    };
  }, []);

  // Safe content injection: Prevents cursor jumping and race conditions
  useEffect(() => {
    if (!editor || !chapter) return;

    // Condition A: The user clicked a completely different chapter in the sidebar
    if (loadedChapterIdRef.current !== chapter._id) {
      setTimeout(() => {
        editor.commands.setContent(chapter.content || "");
      }, 0);
      loadedChapterIdRef.current = chapter._id;
    }
    // Condition B: The backend just finished fetching text for the current blank screen
    else if (editor.isEmpty && chapter.content) {
      const hasText = Object.keys(chapter.content).length > 0;

      if (hasText) {
        setTimeout(() => {
          editor.commands.setContent(chapter.content || "");
        }, 0);
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
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className="w-7 h-7 flex items-center justify-center border-none bg-transparent rounded-[5px] text-editor-text-secondary text-[13px] transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary font-bold"
            >
              B
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className="w-7 h-7 flex items-center justify-center border-none bg-transparent rounded-[5px] text-editor-text-secondary text-[13px] transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary italic font-['Fraunces']"
            >
              i
            </button>
            <div className="w-px h-4 bg-editor-border-strong mx-1"></div>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className="w-7 h-7 flex items-center justify-center border-none bg-transparent rounded-[5px] text-editor-text-secondary text-[13px] transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary font-bold"
            >
              H
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className="w-7 h-7 flex items-center justify-center border-none bg-transparent rounded-[5px] text-editor-text-secondary text-[13px] transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary font-serif"
            >
              &rdquo;
            </button>
          </div>
          <span className="text-[12px] text-editor-text-tertiary font-['JetBrains_Mono']">
            Chapter {chapter.order || 1} · no target set
          </span>
        </div>

        <EditorTitleInput
          key={chapter._id}
          initialTitle={chapter.title || ""}
          onAutoSave={(title) => handleAutoSave({ title })}
        />

        <CharacterHoverCard characters={characters} />

        <div className="relative">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
