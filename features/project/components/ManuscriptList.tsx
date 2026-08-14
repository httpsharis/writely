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
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#5c5868]">
          Table of Contents
        </h3>
        {!isReadOnly && (
          <button
            onClick={onCreateChapter}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-[#5c5868] transition-colors hover:text-[#c9975a]"
          >
            <Plus className="h-3 w-3" /> Add Chapter
          </button>
        )}
      </div>

      {chapters.length === 0 ? (
        <div className="py-12 text-center font-serif text-[15px] italic text-[#5c5868]">
          The page is blank. Start your masterpiece.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-white/5 border-y border-white/5">
          {chapters.map((chapter, index) => {
            const num = String(index + 1).padStart(2, "0");

            return (
              <div
                key={chapter._id}
                // 🟢 MOBILE FIX: Allow stacking into a flex-col layout on tiny screens if needed, otherwise clean flex-row
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 transition-colors hover:bg-white/5 -mx-2 px-2 sm:-mx-4 sm:px-4 rounded-lg gap-4 sm:gap-0"
              >
                <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                  <span className="font-['JetBrains_Mono'] text-[12px] text-[#5c5868] pt-1">
                    {num}
                  </span>
                  <div className="flex flex-col flex-1 min-w-0 pr-4">
                    <InlineEdit
                      isReadOnly={isReadOnly}
                      value={chapter.title || "Untitled Chapter"}
                      onSave={(val) =>
                        onUpdateChapter(chapter._id, "title", val)
                      }
                      className="font-serif text-[16px] sm:text-[17px] font-medium text-[#ede9e2] group-hover:text-[#c9975a]"
                    />

                    <div className="flex items-center gap-1.5 mt-1">
                      <FileText className="h-3 w-3 text-[#5c5868]" />
                      {isReadOnly ? (
                        <span className="text-[10px] uppercase tracking-widest text-[#948fa0] font-bold">
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
                          className="bg-transparent text-[10px] uppercase tracking-widest text-[#5c5868] outline-none cursor-pointer hover:text-[#ede9e2] font-bold appearance-none"
                        >
                          <option value="draft" className="bg-[#131217]">
                            Draft
                          </option>
                          <option value="published" className="bg-[#131217]">
                            Published
                          </option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* 🟢 MOBILE FIX: pl-9 on mobile indents the stats to align perfectly with the title (past the numbers) */}
                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pl-9 sm:pl-0">
                  <div className="font-['JetBrains_Mono'] text-[11px] sm:text-[12px] text-[#5c5868]">
                    {(chapter.wordCount ?? 0).toLocaleString()} w
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/project/${projectId}/write?chapterId=${chapter._id}`,
                      )
                    }
                    // 🟢 MOBILE FIX: Mobile doesn't have hover, so set base opacity to 100 on mobile, 0 on sm screens
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#c9975a] sm:text-[#5c5868] opacity-100 sm:opacity-0 transition-all group-hover:opacity-100 group-hover:text-[#c9975a]"
                  >
                    Write <ChevronRight className="w-3 h-3" />
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