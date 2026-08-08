import { useRouter } from "next/navigation";
import type { Document } from "../../../redux/features/documents/documentApi";

export const HubChapterList = ({ chapters }: { chapters: Document[] }) => {
  const router = useRouter();

  if (!chapters.length) {
    return (
      <div className="rounded-md border border-dashed border-white/10 px-6 py-8 text-center text-[13px] text-[#5c5868]">
        This manuscript currently has no chapters available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {chapters.map((chapter, i) => (
        <div
          key={chapter._id}
          onClick={() => router.push(`/chapter/${chapter.slug}`)}
          className="group flex cursor-pointer items-center gap-5 rounded-md border border-transparent bg-[#1b1a21]/30 px-5 py-4 transition-all hover:border-white/5 hover:bg-[#1b1a21]"
        >
          <span className="w-6 shrink-0 font-mono text-[11px] text-[#c9975a] opacity-70 transition-opacity group-hover:opacity-100">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="mb-1 font-serif text-lg text-[#ede9e2] transition-colors group-hover:text-white">
              {chapter.title || "Untitled Chapter"}
            </span>
            <span className="flex items-center gap-2 font-mono text-[11px] text-[#5c5868]">
              {chapter.wordCount || 0} words
              <span className="h-1 w-1 rounded-full bg-[#5c5868]/50" />
              {new Date(chapter.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
