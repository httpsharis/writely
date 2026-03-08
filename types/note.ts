// ─── Note Document ──────────────────────────────────────────────────

export interface INote {
    userEmail: string;
    novelId?: string;
    novelTitle?: string;
    title: string;
    /** Tiptap JSON content stored as a flexible object */
    content: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

// ─── API Request Types ──────────────────────────────────────────────

export interface CreateNoteInput {
    novelId?: string;
    novelTitle?: string;
    title?: string;
    content?: Record<string, unknown>;
}

export interface UpdateNoteInput {
    novelId?: string | null;
    novelTitle?: string | null;
    title?: string;
    content?: Record<string, unknown>;
}
