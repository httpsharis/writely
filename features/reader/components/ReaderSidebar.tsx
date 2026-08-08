import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Document } from "../../../redux/features/documents/documentApi"

interface ReaderSidebarProps {
  novel?: Document;
  chapters: Document[];
  activeChapterId: string;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

export const ReaderSidebar = ({ novel, chapters, activeChapterId, isMobileOpen, closeMobile }: ReaderSidebarProps) => {
  const router = useRouter();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[85%] max-w-[320px] flex-col border-r border-white/5 bg-[#131217] shadow-2xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:w-[300px] lg:translate-x-0 lg:bg-[#131217]/50 lg:shadow-none ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col overflow-y-auto p-6 md:p-8">
          <button onClick={() => router.push(`/novel/${novel?.slug}`)} className="group mb-10 flex w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c5868] transition-colors hover:text-[#ede9e2]">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Hub
          </button>
          
          <h3 className="mb-6 font-serif text-[18px] text-[#ede9e2] leading-snug">{novel?.title || "Table of Contents"}</h3>
          
          <nav className="flex flex-col gap-1">
            {chapters.map((ch, i) => {
              const isActive = ch._id === activeChapterId;
              return (
                 <button
                   key={ch._id}
                   onClick={() => { closeMobile(); router.push(`/chapter/${ch.slug}`); }}
                   className={`group flex items-center gap-4 rounded-md px-3 py-2.5 text-left text-[14px] transition-all ${isActive ? "bg-[#c9975a]/10 font-medium text-[#c9975a]" : "text-[#948fa0] hover:bg-white/5 hover:text-[#ede9e2]"}`}
                 >
                   <span className={`font-mono text-[10px] transition-colors ${isActive ? "text-[#c9975a]" : "text-[#5c5868] group-hover:text-[#948fa0]"}`}>{String(i + 1).padStart(2, '0')}</span>
                   <span className="truncate">{ch.title}</span>
                 </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};