import Mention from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import { MentionList } from "./MentionList";

export const getSuggestionOptions = (getCharacters: () => any[]) => {
  return {
    items: ({ query }: { query: string }) => {
      const characters = getCharacters();
      return characters
        .filter((item) => item.name.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5)
        .map((char) => {
          let cleanDesc = char.bio || char.description || "";
          cleanDesc = cleanDesc.replace(/\*\*/g, "").replace(/\n+/g, " ").trim();
          
          return {
            id: char._id || char.name,
            name: char.name,
            description: cleanDesc,
            avatar: char.avatarUrl || char.avatar || "",
          };
        });
    },
    render: () => {
      let component: ReactRenderer<any>;
      let popup: TippyInstance[];

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },

        onUpdate(props: any) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          if (props.event.key === "Escape") {
            popup[0].hide();
            return true;
          }

          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
};

export const CharacterMention = Mention.extend({
  name: "characterMention",
  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      {
        ...HTMLAttributes,
        "data-type": "character-mention",
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
        class: "character-mention-node font-bold text-[#c9975a] cursor-pointer hover:underline transition-all",
      },
      `@${node.attrs.label}`,
    ];
  },
});
