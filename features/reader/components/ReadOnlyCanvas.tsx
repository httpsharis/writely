import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { CharacterMention, getSuggestionOptions } from "../../editor/components/extensions/CharacterMention";
import { CharacterHoverCard } from "../../../components/shared/CharacterHoverCard";

interface ReadOnlyCanvasProps {
  content?: Record<string, unknown> | string;
  characters?: Record<string, unknown>[];
}

export const ReadOnlyCanvas = ({ content, characters = [] }: ReadOnlyCanvasProps) => {
  const charactersRef = useRef(characters);

  useEffect(() => {
    charactersRef.current = characters;
  }, [characters]);

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit, 
      Underline,
      CharacterMention.configure({
        HTMLAttributes: {
          class: 'character-mention',
        },
        // eslint-disable-next-line react-hooks/refs
        suggestion: getSuggestionOptions(() => charactersRef.current),
      }),
    ],
    editorProps: {
      attributes: { 
        class: "font-serif text-[18px] md:text-[20px] lg:text-[21px] leading-[1.8] md:leading-[2] text-[#e0e0e0] outline-none whitespace-pre-wrap [&_p]:mb-[1.5em] md:[&_p]:mb-[2em] tracking-[0.01em] prose prose-invert max-w-none" 
      },
    },
  });

  useEffect(() => {
    if (editor && content && Object.keys(content).length > 0) {
      setTimeout(() => {
        editor.commands.setContent(content);
      }, 0);
    }
  }, [editor, content]);

  return (
    <div className="relative">
      <CharacterHoverCard characters={characters} />
      <EditorContent editor={editor} />
    </div>
  );
};