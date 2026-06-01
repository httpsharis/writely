"use client";

import { Editor } from "novel";
import { useState } from "react";

// Define the expected properties to satisfy TypeScript
interface NovelEditorProps {
  chapter?: any;
  onSave?: (data: any) => Promise<void> | void;
}

export default function NovelEditor({ chapter, onSave }: NovelEditorProps) {
  const [status, setStatus] = useState("Saved");

  return (
    <div className="relative w-full max-w-screen-lg mx-auto mt-4">
      
      <div className="absolute -top-8 right-0 text-[12px] font-medium text-[#828A9F]">
        {status}
      </div>

      <Editor 
        className="min-h-[500px] w-full bg-transparent text-[#E2E8F0] border-none shadow-none prose prose-invert prose-headings:text-white prose-a:text-[#535CE8] focus:outline-none"
        
        defaultValue={chapter?.content || {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: chapter?.title || "Untitled Chapter" }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "Start writing here..." }],
            },
          ],
        }}
        
        disableLocalStorage={true} 
        debounceDuration={1000}
        
        // Add explicit 'any' type to silence the compiler error
        onDebouncedUpdate={async (editor: any) => {
          setStatus("Saving...");
          
          const json = editor?.getJSON();
          
          if (onSave) {
            await onSave(json);
          }
          
          setStatus("Saved");
        }}
      />
    </div>
  );
}