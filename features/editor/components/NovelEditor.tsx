"use client";

import { useEffect, useRef, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { toast } from "sonner";

import EditorTitleInput from "../../../components/editor/EditorTitleInput";
import { useEditorContext } from "@/features/editor/context/EditorContext";
import {
  CharacterMention,
  getSuggestionOptions,
} from "./extensions/CharacterMention";
import { CharacterHoverCard } from "../../../components/shared/CharacterHoverCard";
import { useGetNovelCharactersQuery } from "@/redux/features/characters/characterApi";
import {
  saveLocalDraft,
  getLocalDraft,
  isLocalDraftNewer,
} from "@/lib/draftStorage";

const BASE_EXTENSIONS = [
  StarterKit,
  Underline,
  Placeholder.configure({ placeholder: "Start writing..." }),
  CharacterCount,
];

export default function NovelEditor() {
  const {
    novel,
    activeChapter: chapter,
    handleAutoSave,
    setLiveWordCount,
  } = useEditorContext();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const loadedChapterIdRef = useRef<string | null>(null);

  const { data } = useGetNovelCharactersQuery(novel?._id ?? "", {
    skip: !novel?._id,
  });
  const characters = useMemo(() => data?.characters || [], [data?.characters]);
  const charactersRef = useRef(characters);

  useEffect(() => {
    charactersRef.current = characters;
  }, [characters]);

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
          class: "character-mention",
        },
        // eslint-disable-next-line react-hooks/refs
        suggestion: getSuggestionOptions(() => charactersRef.current),
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "font-['Fraunces'] text-[17px] sm:text-[19px] leading-[1.75] text-editor-text-primary outline-none min-h-[300px] whitespace-pre-wrap [&_p]:mb-[1.2em]",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const words = ed.storage.characterCount.words();
      const content = ed.getJSON();

      setLiveWordCount(words);
      latestDataRef.current = { content, words };

      // 🛡️ Instant Local Storage Safety Net (0 data loss on every keystroke)
      if (chapter?._id) {
        saveLocalDraft(chapter._id, {
          content,
          wordCount: words,
          title: chapter.title,
        });
      }

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        autoSaveRef.current({ content, wordCount: words });
        debounceRef.current = undefined;
      }, 2000);
    },
  });

  // Fail-Safe Unmount & beforeunload window listener
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chapter?._id && latestDataRef.current.content) {
        saveLocalDraft(chapter._id, {
          content: latestDataRef.current.content,
          wordCount: latestDataRef.current.words,
          title: chapter.title,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        autoSaveRef.current({
          content: latestDataRef.current.content,
          wordCount: latestDataRef.current.words,
        });
      }
    };
  }, [chapter?._id, chapter?.title]);

  // Safe content injection with Local Storage Recovery Check
  useEffect(() => {
    if (!editor || !chapter) return;

    if (loadedChapterIdRef.current !== chapter._id) {
      let contentToLoad = chapter.content || "";

      // 🛡️ Check if a newer offline/unsaved draft exists in localStorage
      if (chapter._id && isLocalDraftNewer(chapter._id, chapter.updatedAt)) {
        const localDraft = getLocalDraft(chapter._id);
        if (localDraft && localDraft.content) {
          contentToLoad = localDraft.content;
          toast.info("Restored un-synced edits from local device", {
            description: `Recovered draft from ${new Date(localDraft.timestamp).toLocaleTimeString()}`,
            id: `recovery-${chapter._id}`,
          });
        }
      }

      setTimeout(() => {
        editor.commands.setContent(contentToLoad);
      }, 0);
      loadedChapterIdRef.current = chapter._id;
    } else if (editor.isEmpty && chapter.content) {
      const hasText = Object.keys(chapter.content).length > 0;

      if (hasText) {
        setTimeout(() => {
          editor.commands.setContent(chapter.content || "");
        }, 0);
      }
    }
  }, [chapter, editor]);

  if (!chapter) return null;

  return (
    <div className="h-full w-full flex justify-center overflow-y-auto px-4 py-6 sm:px-8 sm:py-12 md:py-16">
      <div className="w-full max-w-[680px]">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-[2px] rounded-lg border border-editor-border bg-editor-surface p-1">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className="flex h-7 w-7 items-center justify-center rounded-[5px] border-none bg-transparent text-[13px] font-bold text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary cursor-pointer"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className="flex h-7 w-7 items-center justify-center rounded-[5px] border-none bg-transparent text-[13px] font-['Fraunces'] italic text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary cursor-pointer"
            >
              i
            </button>
            <div className="mx-1 h-4 w-px bg-editor-border-strong"></div>
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className="flex h-7 w-7 items-center justify-center rounded-[5px] border-none bg-transparent text-[13px] font-bold text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary cursor-pointer"
            >
              H
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className="flex h-7 w-7 items-center justify-center rounded-[5px] border-none bg-transparent font-serif text-[13px] text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary cursor-pointer"
            >
              &rdquo;
            </button>
          </div>
          <span className="hidden text-[12px] font-['JetBrains_Mono'] text-editor-text-tertiary sm:inline">
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
