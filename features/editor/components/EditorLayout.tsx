"use client";

import NovelEditor from "./NovelEditor";
import EditorSidebar from "./EditorSidebar";
import PublishDialog from "./PublishDialog";
import { EditorHeader } from "./EditorHeader";
import { useEditorContext } from "../context/EditorContext";

/**
 * EditorLayout: The primary architectural shell for the writing interface.
 * Handles the grid layout, animated save bar, and conditional modal rendering.
 */
export function EditorLayout() {
  const { novel, isSidebarOpen, saveStatus, isPublishModalOpen } = useEditorContext();

  return (
    <div className="grid h-screen grid-rows-[auto_2px_1fr] overflow-hidden bg-editor-bg font-['Inter'] text-editor-text-primary antialiased selection:bg-editor-gold-soft selection:text-editor-text-primary">
      {/* Modals */}
      {isPublishModalOpen && novel && <PublishDialog />}

      {/* Top Header */}
      <EditorHeader />

      {/* Animated Saving Progress Bar */}
      <div className="relative overflow-hidden bg-transparent">
        <div className={`absolute inset-0 origin-left scale-x-0 transform bg-editor-gold opacity-0 ${saveStatus === 'saving' ? 'animate-editor-fill' : ''}`} />
      </div>

      {/* Main Workspace (Canvas + Sidebar) */}
      <div className={`grid min-h-0 max-w-[100vw] ${isSidebarOpen ? 'grid-cols-[1fr_320px]' : 'grid-cols-1'}`}>
        <NovelEditor />
        {isSidebarOpen && <EditorSidebar />}
      </div>
    </div>
  );
}