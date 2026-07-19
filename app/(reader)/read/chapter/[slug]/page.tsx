"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetPublicDocumentQuery, useLikePublicDocumentMutation } from "@/redux/features/documents/documentApi";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Heart, ArrowLeft } from "lucide-react";

const EXTENSIONS = [StarterKit, Underline];

export default function PublicChapterReaderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data, isLoading, error } = useGetPublicDocumentQuery(slug);
  const [likeDocument, { isLoading: isLiking }] = useLikePublicDocumentMutation();
  
  const chapter = data?.document;

  const editor = useEditor({
    editable: false,
    extensions: EXTENSIONS,
    editorProps: {
      attributes: {
        class: "font-serif text-[19px] leading-[1.75] text-[#ede9e2] outline-none min-h-[300px] whitespace-pre-wrap [&_p]:mb-[1.2em]",
      },
    },
  });

  useEffect(() => {
    if (editor && chapter?.content && Object.keys(chapter.content).length > 0) {
      editor.commands.setContent(chapter.content);
    }
  }, [editor, chapter]);

  const handleLike = async () => {
    if (!chapter) return;
    try {
      await likeDocument(slug).unwrap();
    } catch (err) {
      console.error("Failed to like chapter", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#131217]">
        <div className="w-6 h-6 animate-spin rounded-full border-t-2 border-[#c9975a]" />
      </div>
    );
  }

  if (error || !chapter || chapter.type !== "chapter") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#131217] text-[#ede9e2]">
        <p className="font-serif text-2xl mb-4">Chapter not found or is private.</p>
        <button onClick={() => router.back()} className="text-xs font-bold uppercase tracking-widest text-[#948fa0] hover:text-[#ede9e2]">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131217] text-[#ede9e2] font-sans antialiased overflow-y-auto">
      <div className="max-w-[700px] mx-auto px-8 py-16">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#948fa0] hover:text-[#ede9e2] transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hub
        </button>

        <header className="mb-12 border-b border-[rgba(255,255,255,0.07)] pb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="font-mono text-[11px] text-[#c9975a]">
              Chapter {chapter.order || 1}
            </span>
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] border border-[#c9975a] text-[#c9975a] text-xs transition-colors hover:bg-[rgba(201,151,90,0.1)] disabled:opacity-50"
            >
              <Heart className="w-4 h-4 fill-current" />
              {chapter.likesCount || 0}
            </button>
          </div>
          <h1 className="font-serif text-[40px] leading-tight text-[#ede9e2] mb-4">
            {chapter.title || "Untitled Chapter"}
          </h1>
          <div className="flex items-center gap-2 text-[12px] text-[#5c5868] font-mono">
            {chapter.wordCount || 0} words 
            <span className="w-[3px] h-[3px] rounded-full bg-[#5c5868]" /> 
            {new Date(chapter.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </header>

        <article className="relative">
          <EditorContent editor={editor} />
        </article>
        
        <footer className="mt-20 pt-8 border-t border-[rgba(255,255,255,0.07)] flex flex-col items-center justify-center text-[#5c5868]">
          <span className="font-serif italic text-lg mb-4">Enjoying the story?</span>
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center gap-2 px-6 py-3 rounded-[30px] border border-[#c9975a] text-[#c9975a] hover:bg-[rgba(201,151,90,0.1)] transition-colors disabled:opacity-50 font-semibold"
          >
            <Heart className="w-5 h-5 fill-current" />
            Like this chapter
          </button>
        </footer>

      </div>
    </div>
  );
}
