"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface TailwindEditorProps {
    initialContent?: any;
    onChange?: (content: any) => void;
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

export function TailwindEditor({ initialContent, onChange, saveStatus: externalSaveStatus }: TailwindEditorProps) {
    const [localSaveStatus, setLocalSaveStatus] = useState("Saved");

    const displayStatus = externalSaveStatus 
        ? (externalSaveStatus === 'idle' ? 'Saved' : externalSaveStatus === 'saving' ? 'Saving...' : externalSaveStatus === 'saved' ? 'Saved' : 'Error')
        : localSaveStatus;

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start writing...",
            })
        ],
        content: initialContent || {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Start writing..." }] }],
        },
        editorProps: {
            attributes: {
                class: "prose prose-lg dark:prose-invert prose-p:font-serif prose-headings:font-serif prose-headings:tracking-tight prose-a:text-indigo-500 focus:outline-none max-w-none w-full pb-32",
            },
        },
        onUpdate: ({ editor }) => {
            if (!externalSaveStatus) {
                setLocalSaveStatus("Unsaved");
            }
            if (onChange) {
                onChange(editor.getJSON());
            }
            
            // Debounced save mock
            if (!externalSaveStatus) {
                const timeoutId = setTimeout(() => {
                    setLocalSaveStatus("Saved");
                }, 500);
                return () => clearTimeout(timeoutId);
            }
        },
    });

    // Handle initialContent changes if it acts like a controlled component (though usually it's just initial)
    useEffect(() => {
        if (editor && initialContent && initialContent !== editor.getJSON()) {
            // Optional: uncomment if we need to sync when initialContent prop changes
            // editor.commands.setContent(initialContent);
        }
    }, [editor, initialContent]);

    return (
        <div className="relative w-full max-w-screen-md mx-auto">
            {/* Auto-save Indicator */}
            <div className="absolute -top-10 right-0 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/40">
                {displayStatus === "Unsaved" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                {displayStatus === "Saving..." && <span className="w-3 h-3 border-2 border-foreground/20 border-t-indigo-500 rounded-full animate-spin" />}
                {displayStatus === "Saved" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                {displayStatus === "Error" && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                {displayStatus}
            </div>

            {editor && <EditorContent editor={editor} />}
        </div>
    );
}