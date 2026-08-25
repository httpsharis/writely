"use client";

import { useRouter } from "next/navigation";
import { FileText, Plus, ChevronRight } from "lucide-react";
import InlineEdit from "@/components/ui/InlineEdit";
import type { Document } from "@/redux/features/documents/documentApi";

interface ManuscriptListProps {
  projectId: string;
  chapters: Document[];
  isReadOnly: boolean;
  onCreateChapter: () => void;
  onUpdateChapter: <K extends keyof Document>(
    chapterId: string,
    field: K,
    value: Document[K],
  ) => void;
}

export function ManuscriptList({
  projectId,
  chapters,
  isReadOnly,
  onCreateChapter,
  onUpdateChapter,
}: ManuscriptListProps) {
  const router = useRouter();

  return (
    <div className="mt-8 flex flex-col">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Table of Contents
        </h3>
        {!isReadOnly && (
          <button
            onClick={onCreateChapter}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand hover:text-foreground transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Chapter
          </button>
        )}
      </div>

      {chapters.length === 0 ? (
        <div className="py-14 text-center font-serif text-[15px] italic text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border/60">
          The manuscript is blank. Click &quot;Add Chapter&quot; to begin your story.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border/60 border-y border-border/60">
          {chapters.map((chapter, index) => {
            const num = String(index + 1).padStart(2, "0");

            return (
              <div
                key={chapter._id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 transition-colors hover:bg-secondary/20 -mx-2 px-3 sm:-mx-3 sm:px-3 rounded-xl gap-3 sm:gap-0"
              >
                <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                  <span className="font-mono text-xs text-muted-foreground pt-1">
                    {num}
                  </span>
                  <div className="flex flex-col flex-1 min-w-0 pr-4">
                    <InlineEdit
                      isReadOnly={isReadOnly}
                      value={chapter.title || "Untitled Chapter"}
                      onSave={(val) =>
                        onUpdateChapter(chapter._id, "title", val)
                      }
                      className="font-serif text-[16px] sm:text-[17px] font-medium text-foreground group-hover:text-brand transition-colors"
                    />

                    <div className="flex items-center gap-2 mt-1">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      {isReadOnly ? (
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                          {chapter.status}
                        </span>
                      ) : (
                        <select
                          value={chapter.status || "draft"}
                          onChange={(e) =>
                            onUpdateChapter(
                              chapter._id,
                              "status",
                              e.target.value as
                              | "draft"
                              | "published"
                              | "archived",
                            )
                          }
                          className="bg-transparent text-[10px] uppercase tracking-widest text-muted-foreground outline-none cursor-pointer hover:text-foreground font-bold appearance-none"
                        >
                          <option value="draft" className="bg-card text-foreground">
                            Draft
                          </option>
                          <option value="published" className="bg-card text-foreground">
                            Published
                          </option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pl-8 sm:pl-0">
                  <div className="font-mono text-xs text-muted-foreground">
                    {(chapter.wordCount ?? 0).toLocaleString()} words
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/project/${projectId}/write?chapterId=${chapter._id}`,
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-brand sm:text-muted-foreground opacity-100 sm:opacity-0 transition-all group-hover:opacity-100 group-hover:text-brand cursor-pointer"
                  >
                    Write <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}