// ─── Status & Role Types ────────────────────────────────────────────

export type ProjectStatus = 'planning' | 'drafting' | 'editing' | 'completed';
export type CharacterRole = 'Protagonist' | 'Antagonist' | 'Support' | 'Minor';

// ─── Nested Interfaces ─────────────────────────────────────────────

export interface IProjectStats {
    currentWordCount: number;
    goalWordCount: number;
}

export interface ICharacter {
    name: string;
    role: CharacterRole;
    description?: string;
    avatar?: string;
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
    status?: ProjectStatus;
    stats?: Partial<IProjectStats>;
}
