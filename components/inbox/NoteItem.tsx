import { FileText } from "lucide-react";

// Matches your Mongoose Interface
interface NoteProps {
  title: string;
  type: 'lore' | 'plot' | 'worldbuilding' | 'research' | 'timeline' | 'misc';
  date: string;
  snippet?: string;
}

export default function NoteItem({ title, type, date, snippet }: NoteProps) {
  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-[#E8E0D5] dark:border-[#242424] hover:bg-[#1A1008]/[0.02] dark:hover:bg-[#F0EBE4]/[0.02] transition-colors cursor-pointer -mx-4 px-4 rounded-lg">
      
      <div className="flex items-start gap-4">
        <FileText className="w-4 h-4 text-[#9C8870] dark:text-[#5C5652] mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-[#1A1008] dark:text-[#F0EBE4]">
            {title}
          </span>
          {snippet && (
            <span className="text-[13px] text-[#9C8870] dark:text-[#5C5652] line-clamp-1">
              {snippet}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 md:mt-0 ml-8 md:ml-0 shrink-0">
        <span className="px-2.5 py-1 border border-[#E8E0D5] dark:border-[#242424] rounded-full text-[9px] uppercase tracking-[0.1em] text-[#1A1008] dark:text-[#F0EBE4] bg-transparent">
          {type}
        </span>
        <span className="text-[12px] font-serif italic text-[#9C8870] dark:text-[#5C5652] w-[80px] text-right">
          {date}
        </span>
      </div>

    </div>
  );
}