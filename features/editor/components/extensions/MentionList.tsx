import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion";
import Image from "next/image";

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
      <div className="bg-[#131217] border border-white/10 rounded-lg shadow-xl overflow-hidden p-2 text-xs text-[#5c5868]">
        No characters found
      </div>
    );
  }

  return (
    <div className="bg-[#131217] border border-white/10 rounded-lg shadow-xl overflow-hidden w-80 max-h-80 overflow-y-auto">
      {props.items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => selectItem(index)}
          className={`w-full flex items-center gap-3 p-2 text-left transition-colors ${
            index === selectedIndex
              ? "bg-[#c9975a]/20 border-l-2 border-[#c9975a]"
              : "border-l-2 border-transparent hover:bg-white/5"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-black/40 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5">
            {item.avatar ? (
              <Image src={item.avatar} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#948fa0] text-[10px] font-bold uppercase">{item.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm truncate ${index === selectedIndex ? "text-white" : "text-[#ede9e2]"}`}>
              {item.name}
            </div>
            <div className="text-[10.5px] text-[#5c5868] line-clamp-4 leading-relaxed mt-0.5">{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
});

MentionList.displayName = "MentionList";
