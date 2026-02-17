// ─── Status & Role Types ────────────────────────────────────────────

export type ProjectStatus = 'planning' | 'drafting' | 'editing' | 'completed';
export type CharacterRole = 'Protagonist' | 'Antagonist' | 'Support' | 'Minor';

// ─── Nested Interfaces ─────────────────────────────────────────────

export interface IProjectStats {
    currentWordCount: number;
    goalWordCount: number;
}

export interface ICharacter {
    _id?: string;  // Mongoose subdocument _id (auto-generated)
    name: string;
    role: CharacterRole;
    description?: string;
    avatar?: string;
}

export interface IAuthorNote {
    _id?: string;  // Mongoose subdocument _id (auto-generated)
    text: string;
    createdAt: Date;
}

// ─── Project Document ───────────────────────────────────────────────

export interface IProject {
    userEmail: string;
    title: string;
    description?: string;
    isPublished: boolean;
    status: ProjectStatus;
    stats: IProjectStats;
    characters: ICharacter[];
    authorNotes: IAuthorNote[];
    createdAt: Date;
    updatedAt: Date;
}

// ─── API Request Types ──────────────────────────────────────────────

/** Fields allowed when creating a project */
export interface CreateProjectInput {
    title?: string;
    description?: string;
}

/** Fields allowed when updating a project */
export interface UpdateProjectInput {
    title?: string;
    description?: string;
    isPublished?: boolean;
    status?: ProjectStatus;
    stats?: Partial<IProjectStats>;
    addCharacter?: Omit<ICharacter, 'avatar'>;
    /** Subdocument _id of the character to remove (safe, index-independent) */
    removeCharacterId?: string;
    addAuthorNote?: string;
    /** Subdocument _id of the author note to remove (safe, index-independent) */
    removeAuthorNoteId?: string;
}
