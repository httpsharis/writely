"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { EditorProvider } from "@/features/editor/context/EditorContext";
import { EditorLayout } from "@/features/editor/components/EditorLayout";

/**
 * WritePage: Thin route entry point. 
 * Sole responsibility is wrapping the Editor feature in Suspense and Context Providers.
 */
export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <EditorProvider>
        <EditorLayout />
      </EditorProvider>
    </Suspense>
  );
}