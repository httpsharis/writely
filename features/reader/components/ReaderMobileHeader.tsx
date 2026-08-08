import { Menu, X } from "lucide-react";

interface ReaderMobileHeaderProps {
  novelTitle?: string;
  isOpen: boolean;
  toggle: () => void;
}

export const ReaderMobileHeader = ({ novelTitle, isOpen, toggle }: ReaderMobileHeaderProps) => (
  <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#131217]/90 px-6 py-4 backdrop-blur-md lg:hidden">
    <span className="truncate font-serif text-lg text-[#ede9e2]">{novelTitle || "Reading"}</span>
    <button onClick={toggle} className="text-[#948fa0] transition-colors hover:text-[#ede9e2]">
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  </div>
);