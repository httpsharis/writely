// ─── Tiptap Node Types ──────────────────────────────────────────────

/** Represents a node in the Tiptap JSON document tree. */
export interface TiptapNode {
    type?: string;
    text?: string;
    content?: TiptapNode[];
    [key: string]: unknown;
}

export type ChapterContent = TiptapNode | TiptapNode[] | string;

// ─── Content Utilities ──────────────────────────────────────────────

export const ContentUtils = {
    /**
     * Recursively extracts plain text from a Tiptap JSON structure.
     */
    extractTextFromTiptap(node: ChapterContent | null | undefined): string {
        if (!node) return '';
        if (typeof node === 'string') return node;

        let text = '';

        if (Array.isArray(node)) {
            return node.map(ContentUtils.extractTextFromTiptap).join(' ');
        }

        if (typeof node === 'object') {
            if (node.text) text += ` ${node.text}`;
            if (node.content) text += ` ${ContentUtils.extractTextFromTiptap(node.content)}`;
        }

        return text.trim();
    },

    /**
     * Counts words based on content type.
     */
    countWords(content: ChapterContent, type: string): number {
        let plainText = '';

        switch (type) {
            case 'tiptap':
                plainText = ContentUtils.extractTextFromTiptap(content);
                break;
            case 'html':
                plainText = typeof content === 'string'
                    ? content.replace(/<[^>]*>/g, ' ')
                    : '';
                break;
            case 'markdown':
                plainText = typeof content === 'string' ? content : '';
                break;
            default:
                plainText = typeof content === 'string' ? content : '';
        }

        return plainText.trim().split(/\s+/).filter(Boolean).length;
    },
};