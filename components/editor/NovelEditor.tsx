"use client";

import { forwardRef, useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import BubbleToolbar from "./BubbleToolbar";
import { SlashCommands } from "./slashExtension";
import { useEditorAutoSave } from "@/hooks/useEditorAutoSave";
import { useChapterSync } from "@/hooks/useChapterSync";

import type { ChapterFull } from "@/lib/api-client";
import type { UpdateChapterInput } from "@/types/chapter";
import type { SaveStatus } from "@/hooks/useEditor";

interface Props {
  chapter: ChapterFull | null;
  onAutoSave: (data: UpdateChapterInput) => Promise<void>;
  saveStatus: SaveStatus;
}

const EXTENSIONS = [
  StarterKit,
  Underline,
  Placeholder.configure({ placeholder: "Start writing..." }),
  SlashCommands,
];

const TiptapEditor = forwardRef(function TiptapEditor(
  { chapter, onAutoSave, saveStatus }: Props,
  ref,
) {
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);
  
  const getLatestContent = useCallback(() => editorRef.current?.getJSON(), []);
  const { scheduleSave } = useEditorAutoSave(onAutoSave, saveStatus, getLatestContent);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: EXTENSIONS,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-p:text-[#E2E8F0] prose-headings:text-white max-w-none focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor: ed }) => scheduleSave({ content: ed.getJSON() }),
  });

  useEffect(() => { editorRef.current = editor; }, [editor]);

  const { title, setTitle } = useChapterSync(chapter, editor);

  if (!chapter) {
    return (
      <div className="flex h-full items-center justify-center text-[#828A9F]">
        Select a chapter to begin writing.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          scheduleSave({ title: e.target.value });
        }}
        placeholder="Chapter Title"
        className="w-full bg-transparent text-3xl font-bold text-white outline-none mb-8"
      />
      <div className="relative">
        {editor && <BubbleToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
});

export default TiptapEditor;