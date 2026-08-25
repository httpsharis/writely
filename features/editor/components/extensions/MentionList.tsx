import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/cloudinary";

interface MentionNode {
  id: string;
  name: string;
  description: string;
  avatar?: string;
}

export const MentionList = forwardRef((props: SuggestionProps<MentionNode>, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.name });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: SuggestionKeyDownProps) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }
      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }
      if (event.key === "Enter") {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (!props.items.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden p-3 text-xs text-muted-foreground">
        No characters found
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden w-80 max-h-80 overflow-y-auto">
      {props.items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => selectItem(index)}
          className={`w-full flex items-center gap-3 p-2.5 text-left transition-colors cursor-pointer ${
            index === selectedIndex
              ? "bg-brand/15 border-l-2 border-brand text-foreground"
              : "border-l-2 border-transparent hover:bg-secondary/40 text-muted-foreground"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-secondary/50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-border">
            {item.avatar ? (
              <Image src={getAvatarUrl(item.avatar, 80)} alt={item.name} width={32} height={32} className="w-full h-full object-cover" />
            ) : (
              <span className="text-muted-foreground text-[10px] font-bold uppercase">{item.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-semibold truncate ${index === selectedIndex ? "text-foreground font-bold" : "text-foreground/90"}`}>
              {item.name}
            </div>
            <div className="text-[11px] text-muted-foreground line-clamp-2 leading-snug mt-0.5">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
});

MentionList.displayName = "MentionList";
