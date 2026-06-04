"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

// 🟢 NEW: Import all your modular UI components
import EditorToolbar from "@/components/editor/EditorToolbar";
import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorWordCount from "@/components/shared/WordCount";
import AutoSaveIndicator from "@/components/shared/AutoSave";

export default function WritePage() {
  const params = useParams();
  const projectId = params.id;

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "off">("saved"); 
  const [wordCount, setWordCount] = useState(0);

  // Initialize Tiptap Editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start typing your next masterpiece..." }),
      CharacterCount,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setWordCount(editor.storage.characterCount.words());
      setSaveState("saving");
      setTimeout(() => setSaveState("saved"), 1000);
    },
    editorProps: {
      attributes: {
        class: "min-h-[50vh] text-lg text-foreground/90 leading-relaxed focus:outline-none prose prose-invert max-w-none",
      },
    },
  });

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden animate-in fade-in duration-500">
      
      {/* 1. Main Editor Area */}
      <div className="flex-1 flex flex-col h-full relative transition-all duration-300">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-background/95 backdrop-blur-sm z-10 shadow-sm">
          
          <div className="flex items-center gap-4">
            <Link 
              href={`/project/${projectId}`}
              className="p-2 -ml-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Back to Lobby"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            {/* 🟢 NEW: Universal AutoSave Component */}
            <AutoSaveIndicator state={saveState} />
          </div>

          <div className="flex items-center gap-6">
            
            {/* 🟢 NEW: Universal Word Count Component */}
            <EditorWordCount count={wordCount} label="Words" />
            
            <div className="w-px h-6 bg-border/50"></div>
            
            {/* Sidebar Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 -mr-2 rounded-full transition-colors flex items-center gap-2 ${
                isSidebarOpen ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {isSidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* The Writing Canvas */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-12 px-6 md:px-12 flex justify-center">
          <div className="max-w-2xl w-full flex flex-col">
            
            <input
              type="text"
              placeholder="Chapter Title"
              className="text-4xl font-extrabold bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground/30 w-full mb-6"
            />
            
            {/* 🟢 NEW: Universal Toolbar Component with a custom bottom margin passed via className */}
            <EditorToolbar editor={editor} className="mb-6" />
            
            <div className="mt-2">
              <EditorContent editor={editor} />
            </div>

          </div>
        </div>

      </div>

      {/* 2. Collapsible Sidebar Component */}
      <EditorSidebar isOpen={isSidebarOpen} />

    </div>
  );
}