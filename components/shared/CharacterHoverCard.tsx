"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";

export interface CharacterData {
  name: string;
  bio?: string;
  avatarUrl?: string;
  role?: string;
}

interface CharacterHoverCardProps {
  characters: CharacterData[];
}

export function CharacterHoverCard({ characters }: CharacterHoverCardProps) {
  const [activeCharacter, setActiveCharacter] = useState<CharacterData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hoverState, setHoverState] = useState<{ char: CharacterData; x: number; y: number } | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const mentionNode = target.closest(".character-mention-node");

      if (mentionNode && window.innerWidth >= 768) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const label = mentionNode.getAttribute("data-label");
        const char = characters.find((c) => c.name.toLowerCase() === label?.toLowerCase());

        if (char) {
          const rect = mentionNode.getBoundingClientRect();
          setHoverState({
            char,
            x: rect.left + rect.width / 2,
            y: rect.top - 10, // Position above the text
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement;

      // If we are leaving the mention node and not entering the hover card itself
      if (
        target.closest(".character-mention-node") &&
        !related?.closest(".character-hover-card-portal")
      ) {
        timeoutRef.current = setTimeout(() => {
          setHoverState(null);
        }, 150); // slight delay to allow moving mouse to the card
      }
    };

    const handleCardMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setHoverState(null);
      }, 150);
    };

    const handleCardMouseEnter = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const mentionNode = target.closest(".character-mention-node");

      if (mentionNode) {
        e.preventDefault();
        const label = mentionNode.getAttribute("data-label");
        const char = characters.find((c) => c.name.toLowerCase() === label?.toLowerCase());
        
        if (char) {
          setActiveCharacter(char);
          setIsProfileOpen(true);
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("touchend", handleDocumentClick);

    // Provide handlers to window so the portal can use them
    const win = window as Window & { __handleHoverCardEnter?: () => void; __handleHoverCardLeave?: () => void; };
    win.__handleHoverCardEnter = handleCardMouseEnter;
    win.__handleHoverCardLeave = handleCardMouseLeave;

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("touchend", handleDocumentClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [characters]);

  // Clean bio text to show in card
  const getPreviewText = (bio?: string) => {
    if (!bio) return "No description provided.";
    // Strip markdown bold markers and newlines for a cleaner preview
    return bio.replace(/\*\*/g, "").replace(/\n+/g, " ").trim();
  };

  return (
    <>
      {/* Desktop Hover Card (Rendered via Portal to escape stacking contexts) */}
      {hoverState && typeof document !== "undefined" && createPortal(
        <div
          className="character-hover-card-portal fixed z-[9999] pointer-events-auto transform -translate-x-1/2 -translate-y-full animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{ top: hoverState.y, left: hoverState.x }}
          onMouseEnter={(window as Window & { __handleHoverCardEnter?: () => void }).__handleHoverCardEnter}
          onMouseLeave={(window as Window & { __handleHoverCardLeave?: () => void }).__handleHoverCardLeave}
        >
          <div className="p-3 bg-[#131217] border border-white/10 rounded-xl shadow-2xl flex items-start gap-4 w-[360px]">
            <div className="w-12 h-12 rounded-full bg-black/40 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5">
              {hoverState.char.avatarUrl ? (
                <Image src={hoverState.char.avatarUrl} alt={hoverState.char.name} width={48} height={48} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#948fa0] text-lg font-bold uppercase">{hoverState.char.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[#ede9e2] font-serif font-bold text-base mb-1 truncate">{hoverState.char.name}</h4>
              <p className="text-[#5c5868] text-xs leading-relaxed line-clamp-5">
                {getPreviewText(hoverState.char.bio)}
              </p>
            </div>
          </div>
          {/* Invisible padding area to allow mouse to travel from text to card safely */}
          <div className="absolute top-full left-0 right-0 h-4 bg-transparent" />
        </div>,
        document.body
      )}

      {/* Full Profile Modal/Sheet (Triggered on Click) */}
      {isProfileOpen && activeCharacter && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-[100] animate-in fade-in backdrop-blur-sm"
            onClick={() => setIsProfileOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] bg-[#131217] border border-white/10 rounded-t-3xl md:rounded-3xl p-6 md:p-8 animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-2xl md:max-w-md w-full">
            <button 
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-4 right-4 md:top-5 md:right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-[#948fa0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center overflow-hidden border-2 border-white/10 mb-4 shadow-xl">
                {activeCharacter.avatarUrl ? (
                  <Image src={activeCharacter.avatarUrl} alt={activeCharacter.name} width={80} height={80} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#948fa0] text-3xl font-bold uppercase">{activeCharacter.name.charAt(0)}</span>
                )}
              </div>
              <h4 className="text-[#ede9e2] font-serif font-bold text-2xl mb-2">{activeCharacter.name}</h4>
              <p className="text-[#948fa0] text-sm leading-relaxed max-w-sm whitespace-pre-wrap text-left w-full mt-4 bg-black/20 p-4 rounded-xl border border-white/5">
                {activeCharacter.bio?.replace(/\*\*/g, "") || "No description provided."}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
