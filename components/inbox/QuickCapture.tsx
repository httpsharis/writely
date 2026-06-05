import { Plus } from "lucide-react";

export default function QuickCapture() {
  return (
    <div className="relative group mb-8">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Plus className="w-4 h-4 text-[#9C8870] dark:text-[#5C5652]" />
      </div>
      <input
        type="text"
        placeholder="Capture a raw idea, plot point, or piece of lore..."
        className="w-full bg-transparent border border-[#E8E0D5] dark:border-[#242424] rounded-xl pl-12 pr-4 py-4 text-[14px] text-[#1A1008] dark:text-[#F0EBE4] placeholder:text-[#9C8870] dark:placeholder:text-[#5C5652] focus:outline-none focus:border-[#C8973F] dark:focus:border-[#C8973F] transition-colors shadow-sm"
      />
      {/* Hint that appears on focus (mocked visually here) */}
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C8870] dark:text-[#5C5652] border border-[#E8E0D5] dark:border-[#242424] px-2 py-1 rounded-md">
          Press Enter
        </span>
      </div>
    </div>
  );
}